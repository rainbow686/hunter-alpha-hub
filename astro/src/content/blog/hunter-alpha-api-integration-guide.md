---
title: "Hunter Alpha (mimo-v2) API Integration: Complete Developer Guide"
excerpt: "Integrate Hunter Alpha (Xiaomi mimo-v2) into your app with this complete guide: authentication, streaming, error handling, and production patterns."
author: "Hunter Alpha Hub Team"
publishedAt: "2026-03-23"
category: "Tutorial"
readTime: 9
tags:
  - "mimo-v2"
  - "API"
  - "Developer"
  - "Integration"
  - "Tutorial"
---
## Hunter Alpha (mimo-v2) API Integration: Complete Developer Guide

## Prerequisites

- Node.js 18+ or Python 3.8+
- OpenRouter account with API key
- Basic understanding of REST APIs

## Quick Start (5 Minutes)

### Step 1: Get Your API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up / log in
3. Go to Settings → API Keys
4. Create new key or copy existing

### Step 2: Test Connection

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "xiaomi/mimo-v2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Step 3: Basic Integration

```javascript
// index.js
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'xiaomi/mimo-v2',
    messages: [{ role: 'user', content: 'Hello, Hunter Alpha!' }],
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

---

## Production Integration Patterns

### Pattern 1: Service Class

```javascript
// hunter-alpha-service.js
class HunterAlphaService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.model = 'xiaomi/mimo-v2';
  }

  async chat(message, options = {}) {
    const {
      maxTokens = 4096,
      temperature = 0.7,
      systemPrompt,
    } = options;

    const messages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }]
      : [{ role: 'user', content: message }];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com', // Required by OpenRouter
        'X-Title': 'Your App Name',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async summarizeDocument(document, focus) {
    const prompt = `
Summarize the following document with focus on: ${focus}

Provide:
1. Executive summary (3 sentences)
2. Key points (bullet list)
3. Actionable insights

Document:
${document}
    `;

    return this.chat(prompt, { maxTokens: 2048 });
  }

  async extractEntities(text, entityType) {
    const prompt = `
Extract all ${entityType} from the text below.
Output as JSON array.

Text:
${text}
    `;

    const response = await this.chat(prompt);
    return JSON.parse(response);
  }
}

// Usage
const service = new HunterAlphaService(process.env.OPENROUTER_API_KEY);
const summary = await service.summarizeDocument(longText, 'market trends');
console.log(summary);
```

---

### Pattern 2: Streaming Responses

```javascript
// stream-handler.js
export async function streamHunterAlpha(prompt, onToken) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'xiaomi/mimo-v2',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            onToken(content, fullContent);
          }
        } catch (e) {
          // Skip malformed JSON
        }
      }
    }
  }

  return fullContent;
}

// Usage with Express
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sse = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    await streamHunterAlpha(prompt, (token, full) => {
      sse({ type: 'token', content: token });
    });
    sse({ type: 'done' });
    res.end();
  } catch (error) {
    sse({ type: 'error', message: error.message });
    res.end();
  }
});
```

---

### Pattern 3: Retry with Backoff

```javascript
// retry-handler.js
export async function callWithRetry(
  fn,
  {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
  } = {}
) {
  let lastError;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;

      if (attempt > maxRetries) break;

      // Don't retry on client errors
      if (error.status === 400 || error.status === 401) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      console.log(`Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
const result = await callWithRetry(
  () => hunterAlpha.chat(prompt),
  { maxRetries: 3 }
);
```

---

## Error Handling Reference

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check JSON format, required fields |
| 401 | Unauthorized | Verify API key |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Retry after delay |

### Complete Error Handler

```javascript
class HunterAlphaError extends Error {
  constructor(message, code, retryable = false) {
    super(message);
    this.name = 'HunterAlphaError';
    this.code = code;
    this.retryable = retryable;
  }
}

async function safeApiCall(prompt) {
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
      const errorData = await response.json().catch(() => ({}));

      switch (response.status) {
        case 400:
          throw new HunterAlphaError(
            errorData.error?.message || 'Invalid request',
            400,
            false
          );
        case 401:
          throw new HunterAlphaError('Invalid API key', 401, false);
        case 429:
          throw new HunterAlphaError(
            'Rate limit exceeded',
            429,
            true
          );
        case 500:
        case 503:
          throw new HunterAlphaError(
            'Service temporarily unavailable',
            response.status,
            true
          );
        default:
          throw new HunterAlphaError(
            `Unexpected error: ${response.status}`,
            response.status,
            true
          );
      }
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new HunterAlphaError('Invalid response format', -1, true);
    }

    return data.choices[0].message.content;

  } catch (error) {
    if (error instanceof HunterAlphaError) {
      throw error;
    }
    // Network errors, timeouts, etc.
    throw new HunterAlphaError(
      error.message || 'Unknown error',
      -1,
      true
    );
  }
}
```

---

## Configuration Options

### Full Request Options

```javascript
{
  model: "xiaomi/mimo-v2",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello!" }
  ],
  max_tokens: 4096,      // Max tokens in response
  temperature: 0.7,      // Creativity (0-2)
  top_p: 0.9,           // Nucleus sampling
  frequency_penalty: 0,  // Reduce repetition
  presence_penalty: 0,   // Encourage new topics
  stream: false,         // Enable streaming
}
```

---

## Deployment Checklist

- [ ] API key stored in environment variables
- [ ] Error handling for all status codes
- [ ] Retry logic with exponential backoff
- [ ] Timeout configuration (2-5 minutes)
- [ ] Rate limit monitoring
- [ ] Logging for debugging
- [ ] Fallback model configured

---

*Need help? The API quickstart for each model is on [the model directory](/openrouter-models).*

