"use client";

import { useState } from "react";
import { Button } from "./button";
import { trackOxAlphaSubscribe, trackSubscribeResult, trackSubscribeSubmit } from "@/lib/gtag";

export function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("Failed to subscribe. Please try again.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    trackSubscribeSubmit({ page_path: window.location.pathname });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        trackSubscribeResult({ result: "ok", http_status: response.status });
        trackOxAlphaSubscribe({
          method: "subscription_form",
          page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
          page_location: typeof window !== "undefined" ? window.location.href : undefined,
        });
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        trackSubscribeResult({
          result: response.status === 409 ? "duplicate" : "error",
          http_status: response.status,
        });
        // Surface the server's own explanation when it has one. A deployment
        // with no database says so, and that is not "try again" — the Astro side
        // has done this since the reveal; this path used to throw it away.
        const problem = await response
          .json()
          .then((body: { error?: string; detail?: string }) => body.detail || body.error)
          .catch(() => undefined);
        setError(problem ?? "Failed to subscribe. Please try again.");
        setStatus("error");
      }
    } catch {
      trackSubscribeResult({ result: "error" });
      setError("Failed to subscribe. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: "var(--input-border)",
          borderWidth: "1px",
          borderStyle: "solid",
          color: "var(--foreground)",
        }}
        // No social proof here on purpose: the number would be invented, and the
        // store behind this form has never been reachable in production.
        placeholder="Enter your email"
      />
      <Button type="submit" disabled={status === "submitting"} size="lg">
        {status === "submitting" ? "Subscribing..." : "Subscribe"}
      </Button>

      {status === "success" && (
        <p className="text-green-400 text-sm w-full">Subscribed successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm w-full">{error}</p>
      )}
    </form>
  );
}
