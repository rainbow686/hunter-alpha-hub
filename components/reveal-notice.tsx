import { UNION_ALPHA_REVEAL_SENTENCE } from "@/lib/union-alpha";

/**
 * The "this codename is over" notice for the Union Alpha cluster.
 *
 * Four pages are built around questions that the 2026-09-18 reveal changed the
 * answer to — is it free, how do I use it, why is it failing, what is it. The
 * sentence comes from lib/union-alpha.ts so the four pages cannot drift apart,
 * and so the Astro build renders the same words.
 *
 * `compact` is for pages where the reveal is context rather than the subject.
 */
export function RevealNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="mb-8 rounded-lg border p-4"
      style={{
        borderColor: "var(--card-border)",
        borderLeft: "3px solid var(--accent)",
        background: "var(--card-bg)",
      }}
    >
      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
        Revealed 2026-09-18 · the codename is retired
      </div>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {UNION_ALPHA_REVEAL_SENTENCE}
      </p>
      {!compact && (
        <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
          Everything below is kept as the record of the anonymous window: what was verifiable on the day,
          what was only a claim, and how the answers changed.
        </p>
      )}
    </div>
  );
}
