#!/usr/bin/env bash
# Backs up the local-only docs/ (working memory: ADRs, research, SEO, memory)
# outside the repo, because docs/ is gitignored and exists only on this machine.
# Decision record: docs/decisions/ADR-0006-continuity-kit-v2-adoption.md
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${DOCS_BACKUP_DIR:-$HOME/mycodex/.archive/hunter-alpha-hub-docs}"
KEEP="${DOCS_BACKUP_KEEP:-10}"
STAMP="$(date +%Y-%m-%d-%H%M)"
ARCHIVE="$DEST_DIR/hunter-alpha-hub-docs-$STAMP.tar.gz"

if [ ! -d "$REPO_ROOT/docs" ]; then
  echo "no docs/ directory at $REPO_ROOT" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"
tar -czf "$ARCHIVE" -C "$REPO_ROOT" docs

echo "wrote $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"

# Keep only the newest $KEEP archives.
ls -1t "$DEST_DIR"/hunter-alpha-hub-docs-*.tar.gz 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r old; do
  rm -f "$old"
  echo "pruned $old"
done

echo "backup dir: $DEST_DIR"
