# Video excerpts (the ≤5s tier)

One file per row, named for the source id (`x-2101294219633529030.webp`), plus a matching
entry in the queue:

```json
"media": {
  "kind": "video-excerpt",
  "clip": { "file": "/img/excerpts/x-2101294219633529030.webp", "seconds": 4, "audio": false,
            "source": "X · @author", "asOf": "2026-09-22" }
}
```

Rules are in docs/handbook/writing-style.md and enforced by scripts/check-intake.mjs:
five seconds maximum, silent, source and date stated, link back to the post, and the row
still needs a written note like every other entry. Anything longer, or with audio, fails
the build — a copy wearing a quotation's clothes is what this tier exists to prevent.
