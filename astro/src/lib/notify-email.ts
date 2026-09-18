/**
 * The reveal email — the one message the site promised in exchange for an address.
 *
 * Two things here are load-bearing and easy to get wrong:
 *
 * 1. **`List-Unsubscribe` / `List-Unsubscribe-Post`** (RFC 2369 + RFC 8058). Gmail
 *    and Yahoo require them for bulk senders, and they are what makes the button in
 *    the mail client's own UI unsubscribe without the reader opening the message.
 *    Cloudflare's Email Service allowlists headers and is strict about the values:
 *    the URI must be in angle brackets, must be HTTPS, and the Post header must be
 *    exactly `List-Unsubscribe=One-Click`. It is also DKIM-signed, which RFC 8058
 *    requires — a wrong value fails the send with E_HEADER_VALUE_INVALID rather
 *    than silently shipping a broken unsubscribe path.
 * 2. **The link points at `/unsubscribe?t=…`**, the endpoint that exists since
 *    ADR-0015 (GET confirms, POST deletes). The token in that URL is the only thing
 *    identifying the row, so each recipient gets their own copy of the message —
 *    there is deliberately no shared "unsubscribe everyone" link.
 *
 * Plain, short, factual: this is a notification someone asked for, not a campaign.
 */
import { SITE, SITE_NAME } from "./schema";

export const FROM = { email: "notify@hunteralphahub.com", name: SITE_NAME };
export const REPLY_TO = "privacy@hunteralphahub.com";

export type NotifyKind = "new-codename" | "reveal";

export interface RevealEmailInput {
  kind: NotifyKind;
  /** The codename as it appears on OpenRouter, e.g. "Owl Alpha". */
  codename: string;
  /** For a reveal: what it turned out to be, e.g. "unbiased/pareto (Unbiased)". */
  revealedAs?: string;
  /** One or two sentences of what changed. Kept short on purpose. */
  blurb?: string;
  /** Where to read the full page. Path or absolute URL; defaults to the tracker. */
  url?: string;
  /**
   * This recipient's own unsubscribe URL — **omitted when there is nothing to
   * unsubscribe**. Only a subscriber has a token; a test sent to an address that
   * is not on the list has none, and inventing a placeholder (the first version
   * used 32 zeros) produced a link that looked real, landed on "that address is
   * not on the list", and taught the operator the wrong thing about the flow.
   */
  unsubscribeUrl?: string;
  /** Marks a send as a test in the subject line, so a test can never be mistaken for a notification. */
  test?: boolean;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const absolute = (pathOrUrl: string): string =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

export function subjectFor(input: RevealEmailInput): string {
  const base =
    input.kind === "reveal"
      ? `${input.codename} turned out to be ${input.revealedAs ?? "a model"}`
      : `New OpenRouter codename: ${input.codename}`;
  return input.test ? `[TEST] ${base}` : base;
}

export function textFor(input: RevealEmailInput): string {
  const url = absolute(input.url ?? "/stealth-models");
  const lines = [
    input.kind === "reveal"
      ? `${input.codename} turned out to be ${input.revealedAs ?? "a model"}.`
      : `A new codename is live on OpenRouter: ${input.codename}.`,
    input.blurb ?? "",
    `Details: ${url}`,
    "",
    input.unsubscribeUrl
      ? "You are getting this because you asked to be told when a new codename appears."
      : "This is a test send to an address that is not on the list, so there is nothing to unsubscribe.",
    input.unsubscribeUrl ? `Unsubscribe in one click: ${input.unsubscribeUrl}` : "",
    "",
    `${SITE_NAME} · ${SITE}`,
  ];
  return lines.filter((line) => line !== "").join("\n");
}

export function htmlFor(input: RevealEmailInput): string {
  const url = absolute(input.url ?? "/stealth-models");
  const headline =
    input.kind === "reveal"
      ? `${escapeHtml(input.codename)} turned out to be ${escapeHtml(input.revealedAs ?? "a model")}`
      : `New codename: ${escapeHtml(input.codename)}`;
  const body =
    input.kind === "reveal"
      ? `The anonymous release is no longer anonymous. The page has the model id, the price that replaced the free window, and what it means for the rest of the tracker.`
      : `A new anonymous model just appeared on OpenRouter. The tracker page has the context, what is known so far, and what is still unknown.`;

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#faf6f0;color:#1c1a16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6">
    <div style="max-width:560px;margin:0 auto;background:#fffcf6;border:1px solid #e6ddcd;border-radius:10px;padding:28px">
      <p style="margin:0 0 4px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#5f5849">${escapeHtml(SITE_NAME)}</p>
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25">${headline}</h1>
      ${input.blurb ? `<p style="margin:0 0 16px">${escapeHtml(input.blurb)}</p>` : ""}
      <p style="margin:0 0 20px">${body}</p>
      <p style="margin:0 0 24px"><a href="${escapeHtml(url)}" style="color:#14507d">Read the details on ${escapeHtml(SITE_NAME)} →</a></p>
      <p style="margin:0;font-size:13px;color:#5f5849">${
        input.unsubscribeUrl
          ? `You are getting this because you asked to be told when a new codename appears.
        <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#5f5849">Unsubscribe in one click</a>.`
          : `This is a test send to an address that is not on the list, so there is nothing to unsubscribe — and nothing was stored.`
      }</p>
      ${input.test && input.unsubscribeUrl ? `<p style="margin:12px 0 0;font-size:12px;color:#5f5849">This is a test send from the operator, not a notification.</p>` : ""}
    </div>
  </body>
</html>
`;
}

/**
 * The header set the mail client acts on. Kept in one place so a send can never
 * ship the visible unsubscribe link without the machine-readable one (or the
 * reverse), which is how a list quietly becomes non-compliant.
 */
export function headersFor(input: RevealEmailInput): Record<string, string> {
  /*
   * No unsubscribe link means no list headers. `List-Unsubscribe` is a promise
   * that the URI removes the recipient; sending it to someone who was never on the
   * list would be a header that cannot do what it says.
   */
  if (!input.unsubscribeUrl) return {};
  return {
    "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    Precedence: "bulk",
  };
}

export function unsubscribeUrlFor(token: string): string {
  return `${SITE}/unsubscribe?t=${token}`;
}
