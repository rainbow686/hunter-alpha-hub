"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/card";
import { EvidenceForm } from "@/components/evidence-form";
import { EvidenceCard } from "@/components/evidence-card";
import { Evidence } from "@/lib/types";

export default function EvidenceClient() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvidence = useCallback(async () => {
    try {
      const response = await fetch("/api/evidence");
      if (response.ok) {
        const data = await response.json();
        setEvidenceList(data);
      }
    } catch (error) {
      console.error("Failed to fetch evidence:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Evidence Wall</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Submit and browse community-sourced evidence about Hunter Alpha.
          Each clue brings us closer to solving the mystery.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Submit Evidence</h2>
            <EvidenceForm onSubmitted={fetchEvidence} />
          </Card>
        </div>

        {/* Evidence List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={{ color: "var(--muted)" }}>
              {evidenceList.length} {evidenceList.length === 1 ? "clue" : "clues"} submitted
            </h2>
            <span className="text-sm" style={{ color: "var(--muted)" }}>Sorted by newest</span>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8" style={{ color: "var(--muted)" }}>
                Loading evidence...
              </div>
            ) : evidenceList.length > 0 ? (
              evidenceList.map((evidence) => (
                <EvidenceCard key={evidence.id} evidence={evidence} />
              ))
            ) : (
              <Card className="p-8 text-center" style={{ color: "var(--muted)" }}>
                No evidence yet. Submit the first clue!
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
