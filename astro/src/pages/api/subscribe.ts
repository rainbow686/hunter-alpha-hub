import type { APIRoute } from "astro";

/**
 * POST /api/subscribe — reveal-notification signup.
 *
 * Same path, same body and the same status codes the form already understands:
 *   400 invalid email · 409 already subscribed · 201 created · 503 not stored
 *
 * Storage is Cloudflare D1 (`env.DB`, see ADR-0014). It used to be Supabase over
 * REST with an anon key: two HTTP calls per signup, a third-party account to keep
 * alive, and a failure mode nobody sees — the project behind that key no longer
 * resolves, so every submit answered 503 and not one address was ever stored. A
 * Worker binding removes that whole class of silent failure: either the
 * deployment has the database or it says it does not.
 */
export const prerender = false;

interface Env {
  DB?: D1Database;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** RFC 5321: anything longer than this cannot be delivered to anyone. */
const MAX_EMAIL_LENGTH = 254;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env?: Env } })?.runtime?.env ?? (process.env as Env);
  const db = env.DB;

  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // Validation runs before the configuration check, so a bad address is always a
  // 400 whatever shape the deployment is in.
  if (typeof email !== "string" || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return json({ error: "Invalid email address" }, 400);
  }

  /*
   * One canonical form per address. Stored lower-cased, and the table has a
   * unique index on LOWER(email), so Alice@Example.com cannot subscribe twice —
   * the constraint is the arbiter, not a read-then-write race.
   */
  const normalised = email.trim().toLowerCase();

  if (!db) {
    return json(
      {
        error: "Not configured on this deployment",
        detail:
          "This deployment has no subscription database bound, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
      },
      503,
    );
  }

  try {
    await db
      .prepare("INSERT INTO subscribers (email, source) VALUES (?, ?)")
      .bind(normalised, "site-form")
      .run();
    return json({ success: true }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/UNIQUE constraint|SQLITE_CONSTRAINT/i.test(message)) {
      return json({ error: "Already subscribed" }, 409);
    }
    // 503, not 500: the request was well formed and the binding exists, but the
    // write did not land. That distinction is the difference between a user
    // retyping their address and an operator looking at the deployment.
    console.error(`subscribe: D1 write failed ${message}`.slice(0, 500));
    return json(
      {
        error: "Subscription store unavailable",
        detail:
          "The subscription database refused the write, so nothing was stored. Email contact@hunteralphahub.com and we will add you by hand.",
      },
      503,
    );
  }
};
