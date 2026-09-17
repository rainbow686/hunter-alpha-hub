"use client";

import { useCallback, useEffect, useState } from "react";
import { gtagEvent, trackStealthStatus } from "@/lib/gtag";

interface Status {
  online: boolean | null;
  checkedAt: string;
  contextWindow?: number | null;
  maxOutput?: number | null;
  free?: boolean;
  pricingPerMillion?: { input: number; output: number };
  note?: string;
  error?: string;
}

/**
 * Live "is it still there?" badge for the Union Alpha tracker.
 * Stealth models can vanish overnight, so this polls rather than baking in a status.
 */
export function UnionAlphaStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const startedAt = Date.now();
    try {
      const response = await fetch("/api/union-alpha/status", { cache: "no-store" });
      const data = (await response.json()) as Status;
      setStatus(data);
      trackStealthStatus({
        model_id: "stealth/union-alpha",
        online: data.online,
        free: data.free,
        context_window: data.contextWindow ?? null,
        latency_ms: Date.now() - startedAt,
        error: data.error ? "endpoint_error" : undefined,
      });
    } catch {
      setStatus({ online: null, checkedAt: new Date().toISOString(), error: "Request failed" });
      trackStealthStatus({
        model_id: "stealth/union-alpha",
        online: null,
        latency_ms: Date.now() - startedAt,
        error: "fetch_failed",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    gtagEvent("stealth_model_view", {
      model_id: "stealth/union-alpha",
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, []);

  const label = loading
    ? "Checking OpenRouter…"
    : status?.online === true
      ? "Live on OpenRouter"
      : status?.online === false
        ? "No longer listed"
        : "Status unknown";

  const tone =
    status?.online === true
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : status?.online === false
        ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
        : "border-slate-500/30 bg-slate-500/10 text-slate-300";

  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
          {label}
        </span>
        {status?.checkedAt ? (
          <span className="text-xs opacity-80">
            checked {new Date(status.checkedAt).toISOString().replace("T", " ").slice(0, 16)} UTC
          </span>
        ) : null}
        <button
          type="button"
          onClick={load}
          className="ml-auto rounded border border-current/30 px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80"
        >
          Refresh
        </button>
      </div>

      {status?.online === true ? (
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div>
            <dt className="opacity-70">Context</dt>
            <dd className="font-semibold">
              {status.contextWindow ? `${status.contextWindow.toLocaleString()} tokens` : "—"}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Max output</dt>
            <dd className="font-semibold">
              {status.maxOutput ? `${status.maxOutput.toLocaleString()} tokens` : "—"}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Pricing</dt>
            <dd className="font-semibold">
              {status.free
                ? "Free"
                : status.pricingPerMillion
                  ? `$${status.pricingPerMillion.input}/$${status.pricingPerMillion.output} per M`
                  : "—"}
            </dd>
          </div>
        </dl>
      ) : null}

      {status?.note ? <p className="mt-3 text-xs opacity-90">{status.note}</p> : null}
      {status?.error ? <p className="mt-3 text-xs opacity-90">{status.error}</p> : null}
    </div>
  );
}
