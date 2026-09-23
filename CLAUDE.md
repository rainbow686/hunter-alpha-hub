# CLAUDE.md — hunter-alpha-hub

> Auto-loaded entry point, public and cleaned. Codex reads the Chinese twin `AGENTS.md`; the two files
> state the same discipline and must not drift. Full discipline: `docs/handbook/continuity-kit.md` (local).
> This is the **read map**; the **write map** is `docs/CLOSEOUT.md` — finish every change by walking it.

## What this site is

**hunteralphahub.com** — a reference site for OpenRouter models and for the anonymous "Alpha line" of stealth
listings. It has to do two things, and everything else is optional:

1. **Hand over a number with a source and a date** — 18 curated model pages plus comparison pages, re-read
   against the OpenRouter catalogue every day at 06:00 CST.
2. **Keep the record nobody else keeps** — Alpha-line timings and after-reveal price spans, our own TypeSafe
   Jev measurements, the change log nobody publishes (`/llms.txt`, `/facts.json`, `/alpha-line-report`, CC BY 4.0).

Editorial rule in one line: **facts are dated and labelled, claims say they are claims, and every number
carries its source.**

## Stack (2026-09-22)

- **Cloudflare Workers + Astro static build, asset-first.** `astro/` is the live implementation (ADR-0016).
  The root Next 15 app still deploys but holds no domain — it is the rollback path. Vercel is retired (ADR-0010).
- Subscriptions live in **D1** (ADR-0014); Supabase is retired. Model facts come from an OpenRouter API
  snapshot committed to the repo, not from a live fetch at request time.
- Guards: `cd astro && npx tsc --noEmit && npm run checks` (seven mechanical guards). Run
  `npm run sync-models` when the model snapshot changes.

## For Claude — Docs Map (the only entry)

| Read | When |
|---|---|
| `docs/STARTUP.md` | first thing in a new session: the 60-second recovery order |
| `docs/PROJECT-STATE.md` | the single source of truth (≤50-line snapshot, ⏳ waiting-on-user, next steps, HEAD) |
| `docs/CLOSEOUT.md` | after every change: the write map — which files a given change type must touch |
| `docs/OPERATIONS.md` | commands: dev / verification / branch & release / docs backup |
| `docs/decisions/README.md` → `ADR-*.md` | past decisions (architecture, discipline, direction) |
| `docs/sessions/YYYY-MM-DD-*.md` | continuing a long discussion (>10 turns must have one; append as you go) |
| `docs/memory/YYYY-MM-DD.md` | daily log (write as soon as a unit is verified; append only) |
| `docs/lessons/` | reusable cross-session lessons, one file per lesson |
| `docs/handbook/continuity-kit.md` | this project's discipline — the generic kit's local instance |
| `docs/handbook/writing-style.md` | **before writing or rewriting any page, or making any illustration**: voice + image mix + house drawing style and prompt template (ADR-0020) |
| `docs/roadmap/model-hub.md` | frozen direction (live status belongs to PROJECT-STATE) |

**Rules** — long discussions go to `sessions/`; every verified unit updates the `PROJECT-STATE` snapshot and
appends to `memory/`; finish any change by walking `CLOSEOUT.md`; lessons go to `lessons/`, decisions to an ADR.

## Content rules — new or rewritten pages only (ADR-0020)

Subject-first voice; `we` only where we are the source of a fact or are giving a judgement; provenance in
structure (byline, link, table field) and never narrated; limits in one short clause; never claim care —
demonstrate it. Diagrams are hand-drawn inline SVG; generated images go only where no fact is claimed, and are
never captioned as illustrations or as AI-made. House style: fine-line engraving, warm paper, one accent, 16:9.

**Legacy pages are frozen** — not rewritten, not illustrated (the user chose this on 2026-09-22: they have no traffic).

## Layout and visual truth (ADR-0019, ADR-0011)

- A page with prose is a single **760px centred column**, with every in-page element (text, tables, figures,
  video) inside it. A pure list/index page is full width. **One width per page.**
- Visual truth is `astro/src/styles/system.css` (frozen; guarded by `npm run check:theme`). `tokens.css` and
  `v1–v12.css` in the same folder are the exploration record — nothing new imports them.

## Hard boundaries

- **`docs/` is local-only** — never `git add -f docs/...` (ADR-0001). Back it up: `bash scripts/backup-docs.sh` (ADR-0006).
- **Keys never enter the repo** — real keys live in platform env or the machine's shell config;
  `bash scripts/check-no-secrets.sh` is the tripwire (ADR-0013).
- **Nothing ships without the user's explicit yes** — feature branch → guards → PR → a plain "合" → merge →
  deploy → verify production. `main` takes merges only; test and production credentials never swap.
- **Screenshot any layout, table, figure or copy-length change** before calling it done. Every guard can pass and
  it is still wrong — six incidents in one week, catalogued in `docs/lessons/`.

## Commands

```bash
cd astro
npx tsc --noEmit           # types
npm run checks             # build + seven guards (theme/content/analytics/markup/parity/site-files/subscription) + page verify
npm run sync-models        # only when the model snapshot changes
npm run deploy:production  # only after the merge nod
```
