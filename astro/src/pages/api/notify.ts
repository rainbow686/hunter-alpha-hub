import type { APIRoute } from "astro";
import {
  FROM,
  REPLY_TO,
  headersFor,
  htmlFor,
  subjectFor,
  textFor,
  unsubscribeUrlFor,
  type NotifyKind,
  type RevealEmailInput,
} from "../../lib/notify-email";

/**
 * POST /api/notify — send the reveal email to the people who asked for it.
 *
 * The site's promise is one email per codename. The worker holds the `send_email`
 * binding, so this endpoint is the only code that can keep it — and because it can
 * email every subscriber at once, it is guarded three ways:
 *
 *   1. `Authorization: Bearer <NOTIFY_TOKEN>` — a Worker secret. No token, no
 *      list, and the response says so (401) rather than 404, because "wrong token"
 *      and "no such route" are different problems for whoever is holding a curl.
 *   2. `action` has to be named: `count` (no sending), `test` (one address, and
 *      the subject says TEST), or `broadcast` (everyone).
 *   3. A broadcast must carry a `key` (the codename slug). The first send inserts
 *      it into `broadcasts`; a second run with the same key is a **409**, not a
 *      second email. `force: true` overrides that on purpose.
 *
 * Each recipient gets their own copy, because the only unsubscribe credential is
 * the token in `/unsubscribe?t=…` and it differs per row.
 */
export const prerender = false;

interface Env {
  DB?: D1Database;
  EMAIL?: {
    send(message: {
      to: string;
      from: { email: string; name?: string };
      replyTo?: string;
      subject: string;
      html?: string;
      text?: string;
      headers?: Record<string, string>;
    }): Promise<{ messageId?: string }>;
  };
  NOTIFY_TOKEN?: string;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

interface Body {
  action?: "count" | "test" | "broadcast";
  to?: string;
  key?: string;
  force?: boolean;
  kind?: NotifyKind;
  codename?: string;
  revealedAs?: string;
  blurb?: string;
  url?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env?: Env } })?.runtime?.env ?? (process.env as Env);

  const expected = env.NOTIFY_TOKEN;
  const offered = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!expected) {
    return json(
      {
        error: "Not configured on this deployment",
        detail: "No NOTIFY_TOKEN secret on this Worker, so this endpoint refuses every request.",
      },
      503,
    );
  }
  if (offered !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const db = env.DB;
  if (!db) {
    return json({ error: "Not configured on this deployment", detail: "No D1 binding: no list to read." }, 503);
  }

  let subscribers: { email: string; token: string }[] = [];
  try {
    const result = await db.prepare("SELECT email, token FROM subscribers ORDER BY id").all<{
      email: string;
      token: string;
    }>();
    subscribers = result.results ?? [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`notify: reading subscribers failed ${message}`.slice(0, 500));
    return json({ error: "Subscriber list unavailable", detail: message.slice(0, 300) }, 503);
  }

  if (body.action === "count") {
    return json({ subscribers: subscribers.length }, 200);
  }

  const email = env.EMAIL;
  if (!email) {
    return json(
      {
        error: "Not configured on this deployment",
        detail:
          "No send_email binding on this Worker, so nothing was sent. Add `send_email` to the wrangler config and onboard the sending domain.",
      },
      503,
    );
  }

  const base: Omit<RevealEmailInput, "unsubscribeUrl"> = {
    kind: body.kind ?? "new-codename",
    codename: body.codename ?? "Unknown codename",
    revealedAs: body.revealedAs,
    blurb: body.blurb,
    url: body.url,
  };

  const sendOne = async (to: string, token: string, test: boolean) => {
    const input: RevealEmailInput = { ...base, unsubscribeUrl: unsubscribeUrlFor(token), test };
    return email.send({
      to,
      from: FROM,
      replyTo: REPLY_TO,
      subject: subjectFor(input),
      html: htmlFor(input),
      text: textFor(input),
      headers: headersFor(input),
    });
  };

  if (body.action === "test") {
    if (!body.to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.to)) {
      return json({ error: "A test needs a valid `to` address" }, 400);
    }
    /*
     * The unsubscribe link must be the *recipient's own* token, never someone
     * else's. The first version of this used `subscribers[0]`, which meant a test
     * sent to me carried whichever subscriber happened to be first in the table —
     * and clicking it would have removed that stranger's subscription. When the
     * address is not on the list there is no real link to give, so the test says
     * so in the response and the email says so in its footer.
     */
    const own = subscribers.find((s) => s.email === body.to!.trim().toLowerCase());
    const token = own?.token ?? "0".repeat(32);
    try {
      const result = await sendOne(body.to, token, true);
      return json(
        {
          sent: 1,
          to: body.to,
          messageId: result?.messageId ?? null,
          subject: subjectFor({ ...base, unsubscribeUrl: unsubscribeUrlFor(token), test: true }),
          unsubscribeLinkIsReal: Boolean(own),
        },
        200,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`notify: test send failed ${message}`.slice(0, 500));
      return json({ error: "Send failed", detail: message.slice(0, 400) }, 502);
    }
  }

  if (body.action !== "broadcast") {
    return json({ error: "`action` must be count, test or broadcast" }, 400);
  }

  const key = (body.key ?? "").trim();
  if (!key) {
    return json(
      { error: "A broadcast needs a `key`", detail: "Use the codename slug, e.g. `owl-alpha`." },
      400,
    );
  }
  const subject = subjectFor({ ...base, unsubscribeUrl: "", test: false });
  try {
    await db
      .prepare("INSERT INTO broadcasts (broadcast_key, subject, recipients) VALUES (?, ?, ?)")
      .bind(key, subject, subscribers.length)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/UNIQUE constraint|SQLITE_CONSTRAINT/i.test(message) && !body.force) {
      return json(
        {
          error: "Already sent",
          detail: `A broadcast with key "${key}" is already recorded. Pass "force": true to send again on purpose.`,
        },
        409,
      );
    }
    console.error(`notify: reserving broadcast failed ${message}`.slice(0, 500));
    return json({ error: "Could not record the broadcast", detail: message.slice(0, 300) }, 503);
  }

  const failures: { email: string; error: string }[] = [];
  let sent = 0;
  for (const subscriber of subscribers) {
    try {
      await sendOne(subscriber.email, subscriber.token, false);
      sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ email: subscriber.email, error: message.slice(0, 200) });
      console.error(`notify: send to subscriber failed ${message}`.slice(0, 300));
    }
  }
  try {
    await db
      .prepare("UPDATE broadcasts SET recipients = ?, failures = ? WHERE broadcast_key = ?")
      .bind(sent, failures.length, key)
      .run();
  } catch (error) {
    console.error(`notify: updating broadcast row failed ${String(error).slice(0, 300)}`);
  }

  return json({ key, subject, sent, failed: failures.length, failures: failures.slice(0, 20) }, 200);
};
