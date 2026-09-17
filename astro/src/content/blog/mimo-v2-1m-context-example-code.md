---
title: "Xiaomi mimo-v2 1M Context: Practical Code Examples"
excerpt: "Learn how to use Xiaomi mimo-v2's 1M token context window with real code examples: document analysis, codebase review, multi-turn conversation, and data extraction."
author: "Hunter Alpha Hub Team"
publishedAt: "2026-03-23"
category: "Tutorial"
readTime: 10
tags:
  - "mimo-v2"
  - "Code Examples"
  - "1M Context"
  - "Developer"
  - "Tutorial"
---
## Xiaomi mimo-v2 1M Context: Practical Code Examples

## Quick Start

Xiaomi mimo-v2 (Hunter Alpha) offers a **1 million token context window** — enough for ~700,000 words or 200+ pages of text. This guide shows you how to leverage it with practical code examples.

## Example 1: Full Book Analysis

### Scenario
Analyze an entire novel or technical book in one prompt.

### Code

```javascript
const fs = require('fs');

async function analyzeBook() {
  // Read entire book (example: 400 pages = ~150K tokens)
  const bookContent = fs.readFileSync('./books/clean-code.txt', 'utf8');

  const prompt = `
You are a literary analyst. I will provide a complete book.

Please provide:
1. A 3-sentence summary
2. The 5 most important themes
3. Character development analysis
4. Writing style observations

Here is the book:

${bookContent}
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
  console.log(data.choices[0].message.content);
}

analyzeBook();
```

### Expected Output
```
## Book Analysis: Clean Code by Robert C. Martin

### Summary
"Clean Code" is a comprehensive guide to writing maintainable, readable code...

### Key Themes
1. Meaningful naming conventions
2. Function design principles
3. Comment best practices
...
```

---

## Example 2: Codebase-Wide Review

### Scenario
Review an entire codebase (multiple files) for issues.

### Code

```javascript
const fs = require('fs').promises;
const path = require('path');

async function reviewCodebase() {
  // Collect all source files
  const sourceFiles = [];

  async function walkDir(dir) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = await fs.readFile(filePath, 'utf8');
        sourceFiles.push({ path: filePath, content });
      }
    }
  }

  await walkDir('./src');

  // Combine with file markers
  const combinedCode = sourceFiles
    .map(f => `// === FILE: ${f.path} ===\n${f.content}\n`)
    .join('\n');

  const prompt = `
You are a senior code reviewer. Review this TypeScript codebase for:

1. Security vulnerabilities (XSS, SQL injection, etc.)
2. Type safety issues
3. Performance anti-patterns
4. Code duplication
5. Missing error handling

Provide specific file references and line numbers where possible.

${combinedCode}
  `;

  const response = await callHunterAlpha(prompt);
  console.log(response);
}

async function callHunterAlpha(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'xiaomi/mimo-v2',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

reviewCodebase();
```

---

## Example 3: Multi-Document Comparison

### Scenario
Compare findings across 10+ research papers or reports.

### Code

```javascript
const documents = [
  { title: "Market Research Q1", content: "..." },
  { title: "Market Research Q2", content: "..." },
  { title: "Market Research Q3", content: "..." },
  // ... 10+ documents
];

async function compareDocuments() {
  const formattedDocs = documents
    .map((doc, i) => `### Document ${i + 1}: ${doc.title}\n${doc.content}`)
    .join('\n\n---\n\n');

  const prompt = `
Analyze the following documents and provide:

1. Trends that appear across ALL documents
2. Contradictions between any two documents
3. Unique insights from each document
4. Recommended actions based on combined findings

${formattedDocs}
  `;

  const response = await callHunterAlpha(prompt);

  // Parse structured output
  const sections = response.split(/## |\n\n/).filter(Boolean);
  for (const section of sections) {
    console.log(section);
  }
}

compareDocuments();
```

---

## Example 4: Long Conversation Context

### Scenario
Maintain context across 100+ message conversation.

### Code

```javascript
class ConversationManager {
  constructor() {
    this.messages = [];
  }

  async addMessage(role, content) {
    this.messages.push({ role, content });
  }

  async getResponse(userMessage) {
    await this.addMessage('user', userMessage);

    // mimo-v2 can handle 1M tokens = ~1000+ messages
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'xiaomi/mimo-v2',
        messages: this.messages, // Full conversation history
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    await this.addMessage('assistant', assistantMessage);
    return assistantMessage;
  }

  getTokenCount() {
    // Rough estimate: 4 chars = 1 token
    const totalChars = this.messages.reduce(
      (sum, m) => sum + m.content.length, 0
    );
    return Math.ceil(totalChars / 4);
  }
}

// Usage
const conversation = new ConversationManager();
await conversation.getResponse("Let's start a therapy session...");
await conversation.getResponse("Actually, I've been feeling anxious about work...");
// ... 100+ more exchanges
console.log('Token count:', conversation.getTokenCount()); // Can exceed 500K
```

---

## Example 5: Legal Document Extraction

### Scenario
Extract specific clauses from a 200-page contract.

### Code

```javascript
async function extractLegalClauses(contractText) {
  const prompt = `
You are a legal analyst. Extract the following from this contract:

1. **Termination clauses** - Any conditions under which the contract can be terminated
2. **Liability limitations** - Maximum liability amounts and exclusions
3. **Confidentiality requirements** - Duration and scope of confidentiality
4. **Dispute resolution** - Arbitration requirements, governing law, venue

For each clause, provide:
- Exact quote from the document
- Section/page number
- Plain English explanation

Contract:
${contractText}
  `;

  const response = await callHunterAlpha(prompt);

  // Parse into structured format
  const extracted = {
    termination: extractSection(response, 'Termination'),
    liability: extractSection(response, 'Liability'),
    confidentiality: extractSection(response, 'Confidentiality'),
    disputeResolution: extractSection(response, 'Dispute Resolution'),
  };

  return extracted;
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`##? \\${sectionName}[^]*?(?=##? |$)`, 'i');
  const match = text.match(regex);
  return match ? match[0] : '';
}

// Usage
const contract = fs.readFileSync('./contracts/vendor-agreement.pdf.txt', 'utf8');
const clauses = await extractLegalClauses(contract);
console.log(clauses);
```

---

## Example 6: Data Extraction + CSV Generation

### Scenario
Extract structured data from unstructured text and generate CSV.

### Code

```javascript
async function extractToCSV(textData) {
  const prompt = `
Extract all company mentions from this text and output as CSV.

Columns: Company Name, Industry, Mentioned Context, Sentiment (Positive/Neutral/Negative)

Requirements:
- One row per unique company
- Include exact quotes for context
- Output ONLY the CSV, no other text

Text:
${textData}
  `;

  const response = await callHunterAlpha(prompt);

  // Parse CSV
  const lines = response.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim()]));
  });

  // Write to file
  const csv = lines.join('\n');
  fs.writeFileSync('./output.csv', csv);

  return rows;
}

extractToCSV(earningsCallTranscript);
```

---

## Best Practices

### Context Management

```javascript
// Good: Track token usage
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Good: Chunk when exceeding 500K tokens
if (estimateTokens(content) > 500000) {
  const chunks = splitIntoChunks(content, 100000);
  // Process chunks separately
}

// Good: Use delimiters for clarity
const prompt = `
<document>
${documentContent}
</document>

<instructions>
Summarize the document above...
</instructions>
`;
```

### Error Handling

```javascript
async function safeCall(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('...', {
        method: 'POST',
        headers: { ... },
        body: JSON.stringify({
          model: 'xiaomi/mimo-v2',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

---

*Want more examples? What each anonymous release turned out to be is in [the stealth models register](/stealth-models).*

