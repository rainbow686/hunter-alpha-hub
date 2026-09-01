# OpenRouter Model Hub

OpenRouter Model Hub is a practical comparison site for AI models available on OpenRouter. It focuses on the information developers actually need before choosing a model: pricing, context window, modality support, strengths, limitations and best-fit workloads.

**Live site:** https://hunteralphahub.com

## Primary pages

| Route | Purpose |
|---|---|
| `/comparison` | Core side-by-side comparison of OpenRouter models. |
| `/openrouter-models` | Curated model directory. |
| `/openrouter-models/[slug]` | Per-model pricing, context and usage notes. |
| `/best-openrouter-models` | Scenario-based recommendations. |
| `/openrouter-pricing-calculator` | Monthly cost calculator. |
| `/openrouter-free-models` | Free-tier guidance and limitations. |
| `/access` | General OpenRouter usage guide. |
| `/blog` | Model roundups and practical articles. |

## Stack

- Next.js 15 App Router
- React 19
- TailwindCSS
- Supabase
- Cloudflare Workers via OpenNext

## Local development

```bash
npm install
npm run dev
```

Build and type-check:

```bash
npm run build
npx tsc --noEmit
```

## Cloudflare deployment

Build and preview locally:

```bash
npm run build:cf
npm run preview:cf
```

Deploy to Cloudflare Workers:

```bash
npm run deploy:cf
```

Custom domains:

- `hunteralphahub.com`
- `www.hunteralphahub.com`
- `hunter-alpha-hub.rainbow686.workers.dev`

## Documentation boundary

Operations notes, research, SEO planning, decisions and session logs are kept in local `docs/` files. They are intentionally not committed to the public repository.

## Content model

The model catalog is based on a dated OpenRouter snapshot in `lib/openrouter-models.ts`. Pricing and limits change frequently, so always verify final provider details on OpenRouter before production use.
