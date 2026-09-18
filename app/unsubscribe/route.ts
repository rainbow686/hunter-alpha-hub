import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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
} from "@/lib/unsubscribe-page";

/**
 * GET/POST /unsubscribe?t=<token> — one-click unsubscribe for reveal emails.
 *
 * GET shows a confirmation and changes nothing; POST deletes. A GET that deleted
 * would be one click for a human and zero clicks for a machine: mailbox providers
 * and mail-security scanners fetch every link in a message before the reader
 * opens it, so a mutating GET unsubscribes people who never asked. RFC 8058's
 * "one-click" is a POST with `List-Unsubscribe=One-Click` in the body; the token
 * travels in the query string so both the button in the email and the provider's
 * own UI hit the same URL.
 *
 * This route exists on the Next deployment as well as the Astro one (ADR-0015)
 * because the promise — "we will tell you when the next codename appears" — is
 * live now, on whichever Worker holds the domain, and a link that only works
 * after the cutover is a promise that can break in the gap.
 */

/**
 * The slice of D1 this route uses, declared structurally. Importing
 * `@cloudflare/workers-types` for the `D1Database` name would add Workers globals
 * to a Next build typed against the DOM, and the two sets conflict.
 */
interface Statement {
  bind(...values: unknown[]): {
    first<T>(): Promise<T | null>;
    run(): Promise<unknown>;
  };
}
interface SubscriberDb {
  prepare(query: string): Statement;
}

function subscriberDb(): SubscriberDb | undefined {
  try {
    const { env } = getCloudflareContext();
    return (env as { DB?: SubscriberDb }).DB;
  } catch {
    return undefined;
  }
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** The token arrives in the query string or in a form body; both are the same token. */
async function readToken(request: NextRequest): Promise<string> {
  const fromQuery = request.nextUrl.searchParams.get("t") ?? "";
  if (fromQuery) return fromQuery;
  if (request.method !== "POST") return "";
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      const value = form.get("t");
      return typeof value === "string" ? value : "";
    }
    return "";
  } catch {
    return "";
  }
}

const wantsJson = (request: NextRequest) =>
  request.nextUrl.searchParams.get("format") === "json" ||
  (request.headers.get("accept") ?? "").includes("application/json");

const respond = (
  request: NextRequest,
  copy: UnsubscribeCopy,
  status: number,
  extra: Record<string, unknown> = {},
) => (wantsJson(request) ? json({ status, ...extra }, status) : htmlDocument(copy, status));

export async function GET(request: NextRequest) {
  const token = await readToken(request);
  if (!TOKEN_RE.test(token)) {
    return respond(request, MISSING_TOKEN, 400, { error: "Missing or malformed token" });
  }

  const db = subscriberDb();
  if (!db) {
    console.error("unsubscribe: no D1 binding on this deployment (GET)");
    return respond(request, UNAVAILABLE, 503, { error: "Not configured on this deployment" });
  }

  try {
    const row = await db
      .prepare("SELECT email FROM subscribers WHERE token = ?")
      .bind(token)
      .first<{ email: string }>();
    if (!row) {
      return respond(request, ALREADY_OFF, 200, { state: "already_off" });
    }
    return respond(request, confirmCopy(row.email, token), 200, {
      state: "confirm",
      email: row.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`unsubscribe: D1 read failed ${message}`.slice(0, 500));
    return respond(request, UNAVAILABLE, 503, { error: "Subscription store unavailable" });
  }
}

export async function POST(request: NextRequest) {
  const token = await readToken(request);
  if (!TOKEN_RE.test(token)) {
    return respond(request, MISSING_TOKEN, 400, { error: "Missing or malformed token" });
  }

  const db = subscriberDb();
  if (!db) {
    console.error("unsubscribe: no D1 binding on this deployment (POST)");
    return respond(request, UNAVAILABLE, 503, { error: "Not configured on this deployment" });
  }

  try {
    const row = await db
      .prepare("SELECT email FROM subscribers WHERE token = ?")
      .bind(token)
      .first<{ email: string }>();
    if (!row) {
      return respond(request, ALREADY_OFF, 200, { state: "already_off" });
    }
    await db.prepare("DELETE FROM subscribers WHERE token = ?").bind(token).run();
    return respond(request, doneCopy(row.email), 200, {
      state: "unsubscribed",
      email: row.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`unsubscribe: D1 delete failed ${message}`.slice(0, 500));
    return respond(request, UNAVAILABLE, 503, {
      error: "Subscription store unavailable",
      contact: CONTACT_EMAIL,
    });
  }
}
