import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * POST /api/subscribe — reveal-notification signup.
 *
 * Storage is Cloudflare D1 via the Worker binding (ADR-0014). The previous
 * version called Supabase through @supabase/supabase-js and needed
 * NEXT_PUBLIC_SUPABASE_* at build time, which production never had — so every
 * submit since launch landed in the catch block and not one address was stored.
 *
 * The binding is the deployment's own database, so there is no credential to
 * configure and no third-party project that can quietly disappear.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** RFC 5321: anything longer cannot be delivered. */
const MAX_EMAIL_LENGTH = 254;

/**
 * The unsubscribe token (ADR-0015): 128 bits of randomness, hex, no dashes. It
 * is the only credential that can remove a row, and the only thing the reveal
 * email has to carry. Generated here so the whole signup stays one INSERT.
 */
const newToken = (): string => crypto.randomUUID().replace(/-/g, "");

/**
 * The slice of D1 this route uses, declared structurally on purpose.
 *
 * Pulling in `@cloudflare/workers-types` for one `D1Database` name would add
 * Workers globals (`Request`, `Response`, `fetch` kinds) to a Next build that is
 * typed against the DOM, and those two sets conflict. Naming the two methods we
 * actually call keeps the check useful without the collision.
 */
interface SubscriberStatement {
  bind(...values: unknown[]): { run(): Promise<unknown> };
}
interface SubscriberDb {
  prepare(query: string): SubscriberStatement;
}

/**
 * The binding, or undefined when the app is running somewhere without Workers
 * (a bare `next build`, a preview without D1). Returning undefined rather than
 * throwing keeps "not configured" a 503 with a reason instead of a bare 500.
 */
function subscriberDb(): SubscriberDb | undefined {
  try {
    const { env } = getCloudflareContext();
    return (env as { DB?: SubscriberDb }).DB;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof email !== "string" || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // One canonical form per address: the unique index is on LOWER(email), so the
  // constraint decides duplicates rather than a read-then-write race.
  const normalised = email.trim().toLowerCase();
  const db = subscriberDb();

  if (!db) {
    return NextResponse.json(
      {
        error: "Not configured on this deployment",
        detail:
          "This deployment has no subscription database bound, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
      },
      { status: 503 },
    );
  }

  try {
    await db
      .prepare("INSERT INTO subscribers (email, source, token) VALUES (?, ?, ?)")
      .bind(normalised, "site-form", newToken())
      .run();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/UNIQUE constraint|SQLITE_CONSTRAINT/i.test(message)) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    console.error("Subscribe error:", message);
    return NextResponse.json(
      {
        error: "Subscription store unavailable",
        detail:
          "The subscription database refused the write, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
      },
      { status: 503 },
    );
  }
}
