---
title: "Union Alpha: What We Actually Know About the New Stealth Model on OpenRouter"
excerpt: "Union Alpha appeared on OpenRouter on 16 September 2026 with 256K context, image input, tool calling and $0 pricing — and was revealed two days later as Unbiased Pareto. The verified specs, the community theories, and the reveal."
author: "OpenRouter Model Hub"
publishedAt: "2026-09-17"
category: "Mystery Models"
readTime: 6
tags:
  - "Union Alpha"
  - "OpenRouter"
  - "Stealth Models"
  - "AI Models"
  - "Free Models"
---
## Union Alpha: What We Actually Know

> **Update, 18 September 2026 — the codename is over.** Union Alpha was revealed as **Unbiased Pareto**, developed and operated by **Unbiased**. OpenRouter's stealth page now states it, `stealth/union-alpha` has been removed from the catalogue (the endpoint answers 404), and the same model — same 262,144-token window — is listed as `unbiased/pareto` at $2.50 in / $7.50 out per million tokens. The free window below lasted two days. See the [tracker](/union-alpha) for the dated version of all of it.

On 16 September 2026 an anonymous model called **Union Alpha** appeared on OpenRouter as `stealth/union-alpha`. No announcement, no model card, no named maker — the same pattern as Hunter Alpha and OX Alpha before it.

This post separates the two things most write-ups mix together: **what the catalog says** and **what people are guessing**.

## Verified specs

| Field | Value |
|---|---|
| OpenRouter ID | `stealth/union-alpha` |
| Maker | Unbiased — revealed 2026-09-18 (provider was listed as "Stealth" while anonymous) |
| Context | 262,144 tokens (256K) |
| Max output | 131,072 tokens (128K) |
| Modality | Text + image in, text out |
| Pricing | Free during the window ($0 in / $0 out, 16–18 September); now $2.50 in / $7.50 out per million as `unbiased/pareto` |
| Tool calling | Supported (tools, tool_choice auto, response_format) |
| Added | 2026-09-16 14:42 UTC |

These fields come straight from OpenRouter's public catalog and can be re-checked at any time. The [Union Alpha tracker](/union-alpha) on this site re-checks them live and shows whether the model is still listed.

## What is different from the earlier Alpha models

Two things stand out against Hunter Alpha (later Xiaomi MiMo-V2.5) and OX Alpha (later Z.ai GLM 5.3 Flash):

1. **It takes images.** The earlier two were text-only. This is the first Alpha-line stealth model with vision input.
2. **The context window is smaller.** 256K instead of 1M — still large, but no longer the headline number.

It also advertises tool calling, which is the feature agent builders care about.

## The community theories

Treat everything in this section as unverified. It comes from public discussion in the launch thread, not from the maker, and not from reproducible tests.

### Theory: it is a router, not a model

The most repeated claim is that "Union" refers to a union of models — a routing layer that dispatches to different backends. The supporting evidence is behavioural: multiple testers reported very different quality and style between sessions on the same prompts. That is consistent with routing, and also consistent with aggressive parameter variation, caching quirks, or simply a model that is inconsistent. No one has published a test that distinguishes these cases.

### Theory: a GLM-family model is behind it

Some commenters claimed one of the underlying models comes from the GLM family. No reproducible test was shared. Worth noting that OX Alpha, the previous stealth drop, turned out to be Z.ai's GLM 5.3 Flash — so the guess has a plausible precedent, which is exactly why it deserves scepticism: hindsight-shaped guesses are cheap.

### Theory: it behaves like a Gemini model

One tester reported the model looping on an interactive-editor command during a git rebase and associated the failure mode with Gemini models. That is a single anecdote about one tool-use edge case.

### Theory: a system prompt forces the anonymity story

A commenter described an alleged injected instruction telling the model to say "Union Alpha" and describe its maker as anonymous when asked about its identity. This one deserves extra caution: models routinely confabulate their own identity, and a model's self-report is not evidence about the weights serving it.

## Why you should not build on it yet

Free stealth endpoints are evaluation previews:

- the provider is anonymous and publishes no privacy or data-retention policy;
- pricing can change to non-zero without notice;
- the endpoint can be delisted entirely, which is exactly what happened after both earlier reveals;
- behaviour can change under you if the serving stack is a router.

Use it for experiments, comparisons and throwaway tasks. Do not put customer data, credentials or production traffic through it.

## How to try it

The ID below is dead as of 18 September 2026 — `stealth/union-alpha` answers 404. What the window looked like, for the record:

1. Create an OpenRouter account and open the model page.
2. Select `stealth/union-alpha` in the model picker, or call it through the OpenRouter API with that ID.
3. If you are testing tool calling, note the endpoint advertises `tools`, `tool_choice` (auto), `response_format`, `temperature`, `top_p` and `max_tokens`.

To use the model now, call `unbiased/pareto` — same weights as far as the catalogue shows (identical context window and modality), billed at $2.50 in / $7.50 out per million tokens.

## What to watch for next

The pattern has now held three times: a free window, community investigation, then a reveal and a rename. For Union Alpha that took two days — the shortest of the three. If you want the live status rather than a static article, use the [Union Alpha tracker](/union-alpha) — it checks the catalog on every visit and labels speculation separately from verified specs.

Want to compare Union Alpha against paid models on real workloads? Start from the [model directory](/openrouter-models) or the [comparison hub](/comparison).

