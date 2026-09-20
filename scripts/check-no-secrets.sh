#!/usr/bin/env bash
# Fail if a committed file looks like it carries a live credential.
#
# Why this exists: on 2026-09-18 we found `.mcp.json` — containing a live
# Supabase *service role* key — sitting in this public repo since 2026-03-17.
# Nothing in the pipeline was looking for that. AGENTS.md §5 says real keys never
# enter the repo; this is the check that makes the rule enforceable instead of
# aspirational.
#
# Run: bash scripts/check-no-secrets.sh   (CI runs it on every push/PR)
#
# Not a substitute for rotating a leaked key — it only stops the next one.
set -uo pipefail

# Patterns are written so that this file does not match itself.
PATTERNS=(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[A-Za-z0-9.]'   # Supabase / JWT-style key
  'sk-[A-Za-z0-9_-]{32,}'                               # OpenAI-style key
  'ghp_[A-Za-z0-9]{30,}'                                # GitHub classic PAT
  'github_pat_[A-Za-z0-9_]{30,}'                        # GitHub fine-grained PAT
  'AIza[0-9A-Za-z_-]{35}'                               # Google API key
  'GOCSPX-[A-Za-z0-9_-]{20,}'                           # Google OAuth client secret
  'xox[baprs]-[A-Za-z0-9-]{10,}'                        # Slack token
  # Added 2026-09-20, the day we were issued one. TypeSafe keys are 108 characters
  # behind an `apikey_` prefix, which matched none of the patterns above — the guard
  # was blind to the only live credential this project currently holds.
  'apikey_[A-Za-z0-9_-]{30,}'                           # TypeSafe API key
)

failed=0
for pattern in "${PATTERNS[@]}"; do
  # Placeholder runs (xxxx…, like the `sk-or-v1-xxxx` example in the blog) are
  # not credentials: real base62 keys have no run of eight identical characters.
  hits=$(git grep -nEI -- "$pattern" -- . ':!scripts/check-no-secrets.sh' 2>/dev/null \
    | grep -vEi 'x{8,}' || true)
  if [ -n "$hits" ]; then
    echo "FAIL: tracked file matches /$pattern/"
    echo "$hits" | sed 's/^/  /'
    failed=1
  fi
done

if [ "$failed" -eq 0 ]; then
  echo "OK: no credential-shaped strings in tracked files"
fi
exit "$failed"
