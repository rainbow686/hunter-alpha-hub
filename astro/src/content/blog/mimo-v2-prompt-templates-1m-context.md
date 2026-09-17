---
title: "20 Xiaomi mimo-v2 Prompt Templates for 1M Context"
excerpt: "Ready-to-use prompt templates for Xiaomi mimo-v2 (Hunter Alpha): document analysis, code review, data extraction, and long-form content generation."
author: "Hunter Alpha Hub Team"
publishedAt: "2026-03-23"
category: "Tutorial"
readTime: 12
tags:
  - "mimo-v2"
  - "Prompts"
  - "Templates"
  - "Productivity"
  - "Tutorial"
---
## 20 Xiaomi mimo-v2 Prompt Templates for 1M Context

## How to Use

Copy these templates and customize for your use case. All are optimized for mimo-v2's 1M token context window.

---

## Document Analysis

### Template 1: Executive Summary

```
You are an executive assistant. Summarize the following document for a C-level executive.

Requirements:
- Executive summary: 3 sentences maximum
- Key findings: 5 bullet points
- Risks/concerns: Any red flags
- Recommended actions: 3 concrete next steps

Document:
<document>
[INSERT DOCUMENT HERE]
</document>

Provide your analysis:
```

---

### Template 2: Contradiction Detection

```
Analyze the following document for internal contradictions.

Look for:
- Statements that conflict with each other
- Data that doesn't match across sections
- Claims that contradict the main thesis

For each contradiction found:
1. Quote both conflicting statements
2. Explain the nature of the contradiction
3. Assess severity (Minor/Moderate/Severe)

Document:
[INSERT DOCUMENT HERE]

Output format:
| Location A | Location B | Contradiction | Severity |
|------------|------------|---------------|----------|
| "quote..." | "quote..." | explanation   | High     |
```

---

### Template 3: Multi-Document Synthesis

```
You will analyze multiple documents and synthesize their combined insights.

Documents:
<doc1>
[DOCUMENT 1 CONTENT]
</doc1>

<doc2>
[DOCUMENT 2 CONTENT]
</doc2>

[Add more as needed]

Analysis tasks:
1. What themes appear across ALL documents?
2. Where do the documents disagree?
3. What unique insight does each document provide?
4. What is the combined "so what"?

Provide a structured report with sections for each question.
```

---

### Template 4: Timeline Extraction

```
Extract all dates and associated events from this document.

Output as a timeline:

| Date | Event | Context/Quote |
|------|-------|---------------|
| Jan 2024 | Product launch | "We launched the new feature..." |

Document:
[INSERT DOCUMENT HERE]

Include both explicit dates and relative time references ("next quarter", "in 6 months").
```

---

## Code Review

### Template 5: Security Audit

```
You are a security engineer. Audit this codebase for vulnerabilities.

Check for:
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Insecure dependencies
- Hardcoded secrets

For each issue:
- File path and line number
- Vulnerability type
- Severity (Critical/High/Medium/Low)
- Fix recommendation

Code:
[INSERT CODE HERE]
```

---

### Template 6: Code Quality Review

```
Review this codebase for code quality issues.

Evaluate:
1. Code organization and structure
2. Function design (single responsibility, size)
3. Error handling completeness
4. Type safety (if applicable)
5. Test coverage gaps
6. Performance anti-patterns
7. Code duplication

For each issue:
- Location
- Description
- Impact
- Suggested fix

Code:
[INSERT CODE HERE]
```

---

### Template 7: Architecture Documentation

```
Analyze this codebase and document its architecture.

Create:
1. System overview (what does this system do?)
2. Component diagram (describe in text/ASCII)
3. Data flow description
4. External dependencies
5. Key design patterns used
6. Entry points for new developers

Code:
[INSERT CODE HERE]
```

---

## Data Extraction

### Template 8: Entity Extraction

```
Extract all entities of the following types from this text:
- People (names, titles, roles)
- Organizations (companies, agencies, NGOs)
- Locations (cities, countries, addresses)
- Dates and times
- Monetary amounts
- Products/services

Output as JSON:
{
  "people": [{ "name": "", "title": "", "context": "" }],
  "organizations": [{ "name": "", "type": "", "context": "" }],
  "locations": [{ "name": "", "type": "", "context": "" }],
  "dates": [{ "date": "", "event": "", "context": "" }],
  "monetary": [{ "amount": "", "currency": "", "context": "" }],
  "products": [{ "name": "", "description": "", "context": "" }]
}

Text:
[INSERT TEXT HERE]
```

---

### Template 9: Sentiment Analysis

```
Analyze sentiment throughout this document.

For each paragraph or section:
1. Identify the dominant sentiment (Positive/Neutral/Negative)
2. Note sentiment intensity (1-10)
3. Quote key phrases that indicate sentiment

Track sentiment shifts:
- Where does sentiment change?
- What triggers the change?

Document:
[INSERT DOCUMENT HERE]

Output:
| Section | Sentiment | Intensity | Key Phrases | Notes |
|---------|-----------|-----------|-------------|-------|
| Para 1  | Positive  | 7         | "excited..." | ...   |
```

---

### Template 10: Key Quote Extraction

```
Extract the most significant quotes from this document.

Criteria for "significant":
- Makes a strong claim
- Contains a key insight
- Represents a turning point
- Is quotable in isolation

For each quote:
- Exact quote with page/section reference
- Why it matters (1-2 sentences)
- Potential use case (presentation, report, etc.)

Limit to 10-15 quotes maximum.

Document:
[INSERT DOCUMENT HERE]
```

---

## Content Generation

### Template 11: Blog Post from Technical Doc

```
Transform this technical document into an engaging blog post.

Requirements:
- Catchy title (5 options, I'll pick one)
- Hook opening (first 2 sentences must grab attention)
- Explain technical concepts in plain English
- Use analogies where helpful
- Include subheadings every 200-300 words
- End with a call-to-action

Audience: [Describe your audience]
Tone: [Professional/Casual/Technical/Beginner-friendly]

Technical document:
[INSERT DOCUMENT HERE]
```

---

### Template 12: Email Sequence from Content

```
Create a 5-email sequence based on this content.

Each email should:
- Have a compelling subject line (3 options each)
- Be 150-200 words maximum
- Focus on ONE key idea
- Include a clear call-to-action
- Build on previous email

Email 1: Introduction/hook
Email 2: Problem identification
Email 3: Solution preview
Email 4: Solution details
Email 5: Call-to-action

Source content:
[INSERT CONTENT HERE]
```

---

## Research & Analysis

### Template 13: Literature Review

```
Synthesize the following research papers into a literature review.

For each paper, extract:
- Research question
- Methodology
- Key findings
- Limitations
- How it relates to other papers

Then provide:
1. Consensus findings across papers
2. Areas of disagreement
3. Gaps in the research
4. Future research directions

Papers:
[PAPER 1]
[PAPER 2]
[PAPER 3]
[Add more as needed]
```

---

### Template 14: Competitive Analysis

```
Analyze these competitor materials and provide competitive intelligence.

Materials:
[Competitor A website/product docs]
[Competitor B website/product docs]
[etc.]

Analysis framework:
1. Positioning: How does each competitor position themselves?
2. Features: What features do they emphasize?
3. Pricing: What pricing strategies are used?
4. Messaging: What language do they use?
5. Differentiation: How do they claim to be different?
6. Weaknesses: What gaps can you identify?

Output as structured report with competitor profiles and comparison matrix.
```

---

### Template 15: Customer Interview Analysis

```
Analyze these customer interview transcripts.

For each interview:
1. Key pain points mentioned
2. Current workarounds described
3. Willingness to pay signals
4. Feature requests

Across all interviews:
1. Patterns that appear in 3+ interviews
2. Unexpected insights
3. Segmentation opportunities
4. Priority recommendations

Transcripts:
[INTERVIEW 1]
[INTERVIEW 2]
[etc.]
```

---

## Legal & Compliance

### Template 16: Contract Clause Analysis

```
Analyze this contract and extract key clauses.

For each clause type, provide:
- Exact text from contract
- Section reference
- Plain English explanation
- Any unusual or concerning terms

Clause types to find:
- Termination conditions
- Liability limitations
- Indemnification
- Confidentiality
- Non-compete
- Dispute resolution
- Governing law
- Auto-renewal

Contract:
[INSERT CONTRACT HERE]
```

---

### Template 17: Compliance Checklist

```
Review this policy/procedure document against compliance requirements.

Framework: [GDPR/HIPAA/SOC2/other]

For each requirement:
- State the requirement
- Note whether the document addresses it
- Quote relevant sections
- Identify gaps

Output as checklist:
| Requirement | Addressed? | Section | Gap Description |
|-------------|------------|---------|-----------------|
| ...         | Yes/No     | 3.2.1   | ...             |

Document:
[INSERT DOCUMENT HERE]
```

---

## Creative & Miscellaneous

### Template 18: Character/Persona Development

```
Based on this source material, create detailed character profiles.

For each character:
- Name and basic info
- Background/history
- Motivations and goals
- Fears and weaknesses
- Relationships with others
- Key quotes that define them
- Arc through the material

Source material:
[INSERT BOOK/SCRIPT/INTERVIEW HERE]
```

---

### Template 19: FAQ Generation

```
Generate a comprehensive FAQ from this document.

Process:
1. Identify key topics covered
2. Anticipate reader questions for each topic
3. Extract answers from the document
4. Organize by category

Format:
## Category Name

**Q: [Question]**
A: [Answer extracted from document, with page reference]

Document:
[INSERT DOCUMENT HERE]
```

---

### Template 20: Meeting Notes Synthesis

```
Synthesize these meeting notes/transcripts into actionable output.

Provide:
1. Executive summary (5 sentences)
2. Key decisions made
3. Action items (who, what, by when)
4. Open questions to resolve
5. Topics for next meeting

Notes:
[INSERT MEETING NOTES HERE]
```

---

## Tips for Best Results

1. **Use delimiters**: Wrap content in XML tags like `<document>` for clarity
2. **Be specific**: "Extract dates" is worse than "Extract all dates in Q1 2024"
3. **Specify format**: Request tables, JSON, bullets, etc.
4. **Chunk large content**: For 500K+ tokens, break into sections
5. **Iterate**: Refine prompts based on output quality

---

*Have a great template to add? Share it on the [Hunter Alpha Hub evidence wall](/evidence).*

