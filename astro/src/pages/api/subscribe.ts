import type { APIRoute } from "astro";

/**
 * POST /api/subscribe — reveal-notification signup.
 *
 * Same path, same body and same status codes as the Next route it replaces, so
 * the form does not care which app answers:
 *   400 invalid email · 409 already subscribed · 201 created · 500 upstream · 503 not configured
 *
 * Two deliberate differences from the Next implementation:
 *   - no @supabase/supabase-js dependency: this is two REST calls, which keeps the
 *     Worker bundle small and the behaviour explicit. The contract, not the
 *     client library, is what has to match.
 *   - **it refuses to pretend.** The Next route throws on missing credentials and
 *     returns a generic 500. Here, if the deployment has no Supabase
 *     configuration, the answer is 503 with a message that says exactly that, and
 *     the form shows it. On this preview that is the real state of the world:
 *     nothing is stored until the secrets are set on the Worker.
 *
 * Phase-4 prerequisite (see docs/decisions/ADR-0011): set SUPABASE_URL and
 * SUPABASE_ANON_KEY as secrets on the Astro Worker before cutover, or every
 * signup silently answers 503 instead of being recorded.
 */
export const prerender = false;

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env?: Env } })?.runtime?.env ?? (process.env as Env);
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // Validate before checking configuration: the contract says a bad address is
  // 400, and that should hold whatever the deployment's credentials look like.
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return json({ error: "Invalid email address" }, 400);
  }

  if (!supabaseUrl || !supabaseKey) {
    return json(
      {
        error: "Not configured on this deployment",
        detail:
          "This build of the site has no Supabase credentials, so nothing was stored. The form is wired up; the deployment is not.",
      },
      503,
    );
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  try {
    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}&select=id`,
      { headers },
    );

    if (!existingResponse.ok) {
      // 503, not 500: the request was fine and our credentials are set, but the
      // database did not answer. Saying so is more useful than "try again" — it
      // is the difference between a user retyping their address and an operator
      // looking at the deployment. Measured 2026-09-18: a Supabase project that
      // has been deleted answers like this, and the old code hid it.
      console.error(
        `subscribe: supabase read failed ${existingResponse.status} ${await existingResponse.text().catch(() => "")}`.slice(0, 500),
      );
      return json(
        {
          error: "Subscription store unavailable",
          detail: "The subscription database did not answer, so nothing was stored. Please try again later.",
        },
        503,
      );
    }

    const existing = (await existingResponse.json()) as unknown[];
    if (Array.isArray(existing) && existing.length > 0) {
      return json({ error: "Already subscribed" }, 409);
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ email, subscribed_at: new Date().toISOString() }),
    });

    if (!insertResponse.ok) {
      console.error(
        `subscribe: supabase insert failed ${insertResponse.status} ${await insertResponse.text().catch(() => "")}`.slice(0, 500),
      );
      return json(
        {
          error: "Subscription store unavailable",
          detail: "The subscription database refused the write, so nothing was stored. Please try again later.",
        },
        503,
      );
    }

    return json({ success: true }, 201);
  } catch (error) {
    console.error(`subscribe: request failed ${error instanceof Error ? error.message : String(error)}`.slice(0, 500));
    return json(
      {
        error: "Subscription store unavailable",
        detail: "The subscription database could not be reached, so nothing was stored. Please try again later.",
      },
      503,
    );
  }
};
