---
title: "Build a Document Analysis SaaS with Xiaomi mimo-v2"
excerpt: "Step-by-step guide to building a document analysis SaaS using Xiaomi mimo-v2 (Hunter Alpha): architecture, code examples, pricing, and launch strategy."
author: "Hunter Alpha Hub Team"
publishedAt: "2026-03-23"
category: "Tutorial"
readTime: 11
tags:
  - "mimo-v2"
  - "SaaS"
  - "Business"
  - "Developer"
  - "Tutorial"
---
## Build a Document Analysis SaaS with Xiaomi mimo-v2

## Overview

This guide walks you through building a SaaS product that analyzes long documents using Xiaomi mimo-v2's 1M token context window.

**What we'll build:**
- Upload documents (PDF, TXT, DOCX)
- Get AI-powered analysis: summaries, insights, entity extraction
- Export reports as PDF/Markdown
- Subscription billing

**Tech stack:**
- Frontend: Next.js 15
- Backend: Node.js/Express
- AI: Xiaomi mimo-v2 via OpenRouter
- Database: PostgreSQL
- Storage: AWS S3
- Payments: Stripe

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User      │────▶│  Next.js App │────▶│   OpenRouter│
│  Uploads    │     │   /analyze   │     │  mimo-v2 API│
└─────────────┘     └──────────────┘     └─────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  PostgreSQL  │
                   │  (jobs, users)│
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   AWS S3     │
                   │  (documents) │
                   └──────────────┘
```

---

## Step 1: Project Setup

```bash
# Create Next.js app
npx create-next-app@latest doc-analyzer --typescript --tailwind --app
cd doc-analyzer

# Install dependencies
npm install @openrouter/ai-sdk-provider ai stripe @prisma/client aws-sdk
npm install -D prisma

# Initialize Prisma
npx prisma init
```

---

## Step 2: Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  plan      String   @default("free") // free, pro, enterprise
  credits   Int      @default(5)
  documents Document[]
  createdAt DateTime @default(now())
}

model Document {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  filename    String
  s3Key       String
  status      String   @default("pending") // pending, processing, completed, failed
  analysis    Json?
  tokenCount  Int?
  createdAt   DateTime @default(now())
}
```

---

## Step 3: File Upload API

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user || user.credits <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }

  // Upload to S3
  const s3Key = `documents/${user.id}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: s3Key,
    Body: buffer,
    ContentType: file.type,
  }));

  // Create document record
  const doc = await prisma.document.create({
    data: {
      userId: user.id,
      filename: file.name,
      s3Key,
      status: 'pending',
    },
  });

  // Deduct credit
  await prisma.user.update({
    where: { id: user.id },
    data: { credits: user.credits - 1 },
  });

  return NextResponse.json({ documentId: doc.id });
}
```

---

## Step 4: Analysis Worker

```typescript
// lib/analyze.ts
import { prisma } from './prisma';
import fs from 'fs';
import { createReadStream } from 'fs';
import pdfParse from 'pdf-parse';

export async function analyzeDocument(documentId: string) {
  // Update status
  await prisma.document.update({
    where: { id: documentId },
    data: { status: 'processing' },
  });

  try {
    // Get document
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { user: true },
    });

    if (!doc) throw new Error('Document not found');

    // Download from S3
    const s3 = new S3Client({ /* ... */ });
    const { Body } = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: doc.s3Key,
    }));

    // Extract text (simplified - handle PDF, DOCX)
    let text = '';
    if (doc.filename.endsWith('.pdf')) {
      const pdfBuffer = await streamToBuffer(Body as NodeJS.ReadableStream);
      const pdfData = await pdfParse(pdfBuffer);
      text = pdfData.text;
    } else {
      text = await streamToText(Body as NodeJS.ReadableStream);
    }

    // Estimate tokens
    const tokenCount = Math.ceil(text.length / 4);

    // Call mimo-v2
    const analysis = await callHunterAlpha(text);

    // Save results
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'completed',
        analysis,
        tokenCount,
      },
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'failed' },
    });
  }
}

async function callHunterAlpha(documentText: string) {
  const prompt = `
Analyze the following document and provide:

1. **Executive Summary** (3-5 sentences)
2. **Key Points** (5-10 bullet points)
3. **Entities Extracted** (people, organizations, locations)
4. **Sentiment Analysis** (overall tone)
5. **Action Items** (any tasks or recommendations mentioned)
6. **Questions Raised** (unresolved issues or ambiguities)

Document:
${documentText}
  `;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'xiaomi/mimo-v2',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

---

## Step 5: Frontend Upload Component

```typescript
// components/document-uploader.tsx
'use client';

import { useState } from 'react';

export function DocumentUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      alert('Upload failed: ' + error.error);
      setUploading(false);
      return;
    }

    const data = await response.json();

    // Redirect to analysis page
    window.location.href = `/documents/${data.documentId}`;
  }

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
      <input
        type="file"
        onChange={handleUpload}
        accept=".pdf,.txt,.docx"
        disabled={uploading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-violet-400 hover:text-violet-300"
      >
        {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
      </label>
      <p className="text-sm text-gray-500 mt-2">
        PDF, TXT, or DOCX up to 50MB
      </p>
    </div>
  );
}
```

---

## Step 6: Results Page

```typescript
// app/documents/[id]/page.tsx
export default function DocumentPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    async function fetchDocument() {
      const res = await fetch(`/api/documents/${params.id}`);
      const data = await res.json();
      setDocument(data);
    }
    fetchDocument();

    // Poll for status updates
    const interval = setInterval(fetchDocument, 3000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (!document) return <div>Loading...</div>;

  if (document.status === 'pending' || document.status === 'processing') {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 rounded-full mx-auto" />
        <p className="mt-4">Analyzing your document...</p>
      </div>
    );
  }

  if (document.status === 'failed') {
    return <div>Analysis failed. Please try again.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{document.filename}</h1>

      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{document.analysis}</ReactMarkdown>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-violet-600 rounded hover:bg-violet-700"
        >
          Export as PDF
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(document.analysis)}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
```

---

## Step 7: Pricing Model

### Free Tier
- 5 documents/month
- Up to 100K tokens per document
- Standard analysis template

### Pro ($29/month)
- 50 documents/month
- Up to 500K tokens per document
- Custom analysis templates
- Priority processing

### Enterprise ($199/month)
- Unlimited documents
- Full 1M token context
- API access
- Custom integrations

---

## Cost Analysis

**OpenRouter costs:**
- mimo-v2: Free (as of March 2026)

**Your costs:**
- S3 storage: ~$0.023/GB
- Database: ~$25/month (Neon/Supabase)
- Vercel hosting: Free-$20/month
- Stripe fees: 2.9% + $0.30

**Margins:**
- Pro plan at $29/month with ~$5 infrastructure cost = 83% margin

---

## Launch Checklist

- [ ] Complete MVP (upload, analyze, export)
- [ ] Add user authentication
- [ ] Integrate Stripe billing
- [ ] Set up rate limiting
- [ ] Create landing page
- [ ] Write documentation
- [ ] Launch on Product Hunt
- [ ] Collect user feedback

---

*Building something similar? What each anonymous release turned out to be is in [the stealth models register](/stealth-models).*

