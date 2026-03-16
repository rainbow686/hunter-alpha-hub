"use client";

import { useState } from "react";
import { Button } from "./button";

export function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
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
        placeholder="Enter your email - join 200+ subscribers"
      />
      <Button type="submit" disabled={status === "submitting"} size="lg">
        {status === "submitting" ? "Subscribing..." : "Subscribe"}
      </Button>

      {status === "success" && (
        <p className="text-green-400 text-sm w-full">Subscribed successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm w-full">Failed to subscribe. Please try again.</p>
      )}
    </form>
  );
}
