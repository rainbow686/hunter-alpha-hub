# Design explorations (not built, not published)

These are the eleven homepage design candidates (`v2`–`v12`) plus the two
palette-review pages (`night`, `system`) that were used to pick the current
design system. `v12` won and became `src/layouts/System.astro` +
`src/styles/system.css`; the rest are kept as a record of what was rejected and
why, which is cheaper than re-arguing the same decisions later.

They used to live in `src/pages/`, which meant Astro built and published all
thirteen of them at `/v2` … `/v12`, `/night`, `/system`. On the live Next site
none of those routes exist, so after a Phase-4 cutover they would have been
thirteen 200-OK pages that no page links to and no sitemap declares — the exact
condition the link audit is built to flag, and a set of near-duplicate pages
competing with the real homepage.

They are outside `src/pages/` now, so Astro ignores them. Their imports were
rewritten (`../../src/layouts/...`) so the files still read correctly if someone
opens one, but nothing type-checks or builds them.

To revive one, copy it back into `src/pages/` — and expect the theme guard
(`npm run check:theme`) to have opinions.
