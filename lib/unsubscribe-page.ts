/**
 * The unsubscribe page for the Next deployment.
 *
 * `astro/src/lib/unsubscribe-page.ts` carries the same document for the Astro
 * deployment. Two files rather than one import because the two apps are separate
 * builds with separate tsconfigs, and this URL is the single worst place to
 * discover a cross-build import that only resolves in one of them.
 *
 * Self-contained on purpose: no scripts, no external stylesheet, no webfont, no
 * image. It is opened from an email, in a mail client's in-app browser, on a
 * phone, and sometimes by a link scanner with no JavaScript at all.
 *
 * The palette is the frozen system (`astro/src/styles/system.css`, ADR-0011)
 * inlined; `astro/scripts/check-subscription.mjs` fails if the inline values and
 * system.css ever disagree, or if this file and the Astro twin do.
 */

export interface UnsubscribeCopy {
  title: string;
  heading: string;
  /** Safe HTML: callers interpolate escaped values. */
  body: string;
  /** Present only on the confirmation step, which is the only page with a form. */
  action?: { token: string; label: string };
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const CONTACT_EMAIL = "privacy@hunteralphahub.com";

const STYLE = `
      :root {
        --bg: #faf6f0;
        --surface: #fffcf6;
        --border: #e6ddcd;
        --text: #1c1a16;
        --text-muted: #5f5849;
        --accent: #14507d;
        --on-accent: #ffffff;
        --danger: #9c3327;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #17130f;
          --surface: #26201a;
          --border: #302a22;
          --text: #f4efe4;
          --text-muted: #bdb2a0;
          --accent: #92bcdf;
          --on-accent: #14110d;
          --danger: #ec9f92;
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 48px 20px;
        background: var(--bg);
        color: var(--text);
        font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
        line-height: 1.6;
      }
      main {
        max-width: 560px;
        margin: 0 auto;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 32px;
      }
      p { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; margin: 0 0 16px; }
      h1 { font-size: 28px; line-height: 1.25; margin: 0 0 16px; }
      .muted { color: var(--text-muted); font-size: 14px; }
      .address { font-weight: 600; word-break: break-all; }
      form { margin: 24px 0 0; }
      button {
        font: inherit;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 16px;
        padding: 11px 20px;
        border-radius: 8px;
        border: 1px solid var(--accent);
        background: var(--accent);
        color: var(--on-accent);
        cursor: pointer;
      }
      a { color: var(--accent); }
`;

export function unsubscribeDocument(copy: UnsubscribeCopy): string {
  const action = copy.action
    ? `<form method="post" action="/unsubscribe">
        <input type="hidden" name="t" value="${escapeHtml(copy.action.token)}">
        <button type="submit">${escapeHtml(copy.action.label)}</button>
      </form>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>${escapeHtml(copy.title)} — Hunter Alpha Hub</title>
    <style>${STYLE}</style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(copy.heading)}</h1>
      ${copy.body}
      ${action}
      <p class="muted" style="margin-top: 24px">
        Hunter Alpha Hub · <a href="https://www.hunteralphahub.com/">hunteralphahub.com</a>
      </p>
    </main>
  </body>
</html>
`;
}

export const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

export function htmlDocument(copy: UnsubscribeCopy, status: number): Response {
  return new Response(unsubscribeDocument(copy), { status, headers: HTML_HEADERS });
}

export const escape = escapeHtml;

/** Tokens are 32 hex characters (128 bits). Anything else never came from us. */
export const TOKEN_RE = /^[0-9a-f]{32}$/;

export const MISSING_TOKEN: UnsubscribeCopy = {
  title: "Incomplete unsubscribe link",
  heading: "This unsubscribe link is incomplete",
  body: `<p>The link needs the full address from the email you received — it looks like part of it was cut off, or it was retyped by hand.</p>
      <p>Open the email and use its unsubscribe link instead, or write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and we will remove you by hand.</p>`,
};

export const ALREADY_OFF: UnsubscribeCopy = {
  title: "Already unsubscribed",
  heading: "That address is not on the list",
  body: `<p>Either you already unsubscribed, or this link belongs to an address we no longer hold. Either way, there is nothing left to remove and no email will be sent to it.</p>`,
};

export const UNAVAILABLE: UnsubscribeCopy = {
  title: "Could not reach the list",
  heading: "We could not reach the subscription list",
  body: `<p><strong>Nothing was changed</strong> — the address is still on the list. Please try the link again in a few minutes.</p>
      <p>If it keeps failing, write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and we will remove you by hand.</p>`,
};

/**
 * The two pages that name the address. They live here rather than in each
 * endpoint so that every word a subscriber can see sits in the one file the
 * subscription check compares across the two deployments.
 */
export const confirmCopy = (email: string, token: string): UnsubscribeCopy => ({
  title: "Confirm unsubscribe",
  heading: "Stop the reveal emails?",
  body: `<p>This link belongs to <span class="address">${escapeHtml(email)}</span>. Press the button and that address is removed from the list — nothing else about you is stored, so there is nothing else to delete.</p>
      <p class="muted">Until you press it, nothing changes and the address stays subscribed.</p>`,
  action: { token, label: "Yes, unsubscribe me" },
});

export const doneCopy = (email: string): UnsubscribeCopy => ({
  title: "Unsubscribed",
  heading: "You are off the list",
  body: `<p><span class="address">${escapeHtml(email)}</span> has been removed. No further reveal email will be sent to it.</p>
      <p>Came here by accident? Subscribe again from <a href="https://www.hunteralphahub.com/stealth-models">the codename tracker</a> — the form takes the address back.</p>`,
});
