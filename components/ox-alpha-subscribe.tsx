"use client";

import { useState } from "react";
import { Button } from "./button";

export function OxAlphaSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    // GA4 event - must fire before/with network
    try {
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === "function") {
        gtag("event", "ox_alpha_subscribe", {
          event_category: "engagement",
          event_label: "ox-alpha-mid-subscribe",
          value: 1,
        });
      } else if (typeof window !== "undefined" && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
        // fallback push
        ((window as unknown as { dataLayer: unknown[] }).dataLayer = (window as unknown as { dataLayer: unknown[] }).dataLayer || []).push({
          event: "ox_alpha_subscribe",
        });
      }
      // also dispatch custom event for DebugView visibility
      window.dispatchEvent(new CustomEvent("ox_alpha_subscribe", { detail: { email } }));
    } catch {
      // ignore GA errors
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "ox-alpha" }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="rounded-xl border p-6 md:p-8" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Get notified when OX-alpha is revealed
      </h3>
      <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
        Join 200+ researchers tracking the mystery. One email when the identity drops — no spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--input-border)",
            borderWidth: "1px",
            borderStyle: "solid",
            color: "var(--foreground)",
          }}
          aria-label="Email for OX-alpha reveal notification"
        />
        <Button type="submit" disabled={status === "submitting"} size="lg">
          {status === "submitting" ? "Subscribing..." : status === "success" ? "✓ Subscribed" : "Notify me"}
        </Button>
      </form>
      {status === "success" && (
        <p className="text-green-400 text-sm mt-3">Done — you will be first to know. GA4 event ox_alpha_subscribe fired.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">Failed to subscribe. Please try again.</p>
      )}
      <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>
        By subscribing you agree to our privacy policy. We track <code>ox_alpha_subscribe</code> in GA4 for measurement.
      </p>
    </div>
  );
}
