import Link from "next/link";
import { Card } from "@/components/card";
import { SubscriptionForm } from "@/components/subscription-form";
import { EvidenceCard } from "@/components/evidence-card";
import { readEvidence } from "@/lib/data";

export default function Home() {
  const evidenceList = readEvidence().slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Hunter Alpha</span> Hub
        </h1>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Tracking the <span className="font-mono" style={{ color: "var(--foreground)" }}>Hunter Alpha</span> identity mystery.
          Submit evidence, discuss clues, and stay updated.
        </p>
      </section>

      {/* Latest Evidence */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Latest Evidence</h2>
          <Link
            href="/evidence"
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-4">
          {evidenceList.length > 0 ? (
            evidenceList.map((evidence) => (
              <EvidenceCard key={evidence.id} evidence={evidence} />
            ))
          ) : (
            <Card className="p-8 text-center" style={{ color: "var(--muted)" }}>
              No evidence submitted yet. Be the first!
            </Card>
          )}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-8">
        <Card className="p-8 glow-border" glow>
          <h2 className="text-2xl font-bold mb-2">Get Notified</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Subscribe to receive an email when Hunter Alpha&apos;s identity is revealed.
          </p>
          <SubscriptionForm />
        </Card>
      </section>
    </div>
  );
}
