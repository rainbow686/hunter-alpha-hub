import type { APIRoute } from "astro";
import {
  ALREADY_OFF,
  CONTACT_EMAIL,
  MISSING_TOKEN,
  TOKEN_RE,
  UNAVAILABLE,
  confirmCopy,
  doneCopy,
  htmlDocument,
  type UnsubscribeCopy,
} from "../lib/unsubscribe-page";

/**
 * GET/POST /unsubscribe?t=<token> — one-click unsubscribe for reveal emails.
 *
 * Two steps on purpose, and the split is the whole point:
 *
 *   GET  shows a confirmation button and changes nothing
 *   POST deletes the row
 *
 * A GET that deleted would be one click for a human and zero clicks for a
 * machine: mailbox providers and mail-security scanners fetch every link in a
 * message before the reader ever sees it, so a mutating GET unsubscribes people
 * who never asked. That is why RFC 8058 ("one-click") is a POST with
 * `List-Unsubscribe=One-Click` in the body — the token rides in the query string,
 * so the same URL works for both the button in the email and the mailbox
 * provider's own UI.
 *
 * The token is the only credential: the endpoint never lists addresses, never
 * echoes one it did not just match, and the delete is a single statement scoped
 * by token. Wrong or expired token = "not on the list", with a 200, because an
 * unsubscribe that happened twice is not an error.
 *
 * Storage is Cloudflare D1 (`env.DB`, ADR-0014); tokens are issued by
 * `/api/subscribe` and defined in `d1/migrations/0002_subscriber_tokens.sql`.
 */
export const prerender = false;

interface Env {
  DB?: D1Database;
}

const db = (locals: unknown): D1Database | undefined => {
  const env = (locals as { runtime?: { env?: Env } })?.runtime?.env ?? (process.env as Env);
  return env.DB;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** The token may arrive in the query string or in a form body; both are the same token. */
async function readToken(request: Request, url: URL): Promise<string> {
  const fromQuery = url.searchParams.get("t") ?? "";
  if (fromQuery) return fromQuery;
  if (request.method !== "POST") return "";
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      const value = form.get("t");
      return typeof value === "string" ? value : "";
    }
    // RFC 8058 posts `List-Unsubscribe=One-Click` with no other body; the token
    // is in the query string, which is why this branch only reads text bodies.
    return "";
  } catch {
    return "";
  }
}

const wantsJson = (request: Request, url: URL) =>
  url.searchParams.get("format") === "json" ||
  (request.headers.get("accept") ?? "").includes("application/json");

const respond = (
  request: Request,
  url: URL,
  copy: UnsubscribeCopy,
  status: number,
  extra: Record<string, unknown> = {},
) => (wantsJson(request, url) ? json({ status, ...extra }, status) : htmlDocument(copy, status));

/** GET — show the confirmation. Never deletes: scanners fetch links before readers do. */
export const GET: APIRoute = async ({ request, url, locals }) => {
  const token = await readToken(request, url);
  if (!TOKEN_RE.test(token)) {
    return respond(request, url, MISSING_TOKEN, 400, { error: "Missing or malformed token" });
  }

  const database = db(locals);
  if (!database) {
    console.error("unsubscribe: no D1 binding on this deployment (GET)");
    return respond(request, url, UNAVAILABLE, 503, { error: "Not configured on this deployment" });
  }

  try {
    const row = await database
      .prepare("SELECT email FROM subscribers WHERE token = ?")
      .bind(token)
      .first<{ email: string }>();
    if (!row) {
      return respond(request, url, ALREADY_OFF, 200, { state: "already_off" });
    }
    return respond(request, url, confirmCopy(row.email, token), 200, {
      state: "confirm",
      email: row.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`unsubscribe: D1 read failed ${message}`.slice(0, 500));
    return respond(request, url, UNAVAILABLE, 503, { error: "Subscription store unavailable" });
  }
};

/** POST — the actual removal, and the target of the mailbox provider's one-click. */
export const POST: APIRoute = async ({ request, url, locals }) => {
  const token = await readToken(request, url);
  if (!TOKEN_RE.test(token)) {
    return respond(request, url, MISSING_TOKEN, 400, { error: "Missing or malformed token" });
  }

  const database = db(locals);
  if (!database) {
    console.error("unsubscribe: no D1 binding on this deployment (POST)");
    return respond(request, url, UNAVAILABLE, 503, { error: "Not configured on this deployment" });
  }

  try {
    // Read first so the page can name the address that was removed; the delete is
    // still scoped by token, so a missing row is simply "already off".
    const row = await database
      .prepare("SELECT email FROM subscribers WHERE token = ?")
      .bind(token)
      .first<{ email: string }>();
    if (!row) {
      return respond(request, url, ALREADY_OFF, 200, { state: "already_off" });
    }
    await database.prepare("DELETE FROM subscribers WHERE token = ?").bind(token).run();
    return respond(request, url, doneCopy(row.email), 200, {
      state: "unsubscribed",
      email: row.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`unsubscribe: D1 delete failed ${message}`.slice(0, 500));
    return respond(request, url, UNAVAILABLE, 503, {
      error: "Subscription store unavailable",
      contact: CONTACT_EMAIL,
    });
  }
};
