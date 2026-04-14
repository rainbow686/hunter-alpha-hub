"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/card";
import { EvidenceForm } from "@/components/evidence-form";
import { EvidenceCard } from "@/components/evidence-card";
import { BannerRectangle } from "@/components/adsterra-ads";
import { Evidence } from "@/lib/types";

type ImportanceFilter = "all" | "High" | "Medium" | "Low";

export default function EvidenceClient() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ImportanceFilter>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchEvidence = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const url = `/api/evidence?limit=${pageSize}&offset=${offset}${filter !== "all" ? `&importance=${filter}` : ""}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEvidenceList(data);
      }
    } catch (error) {
      console.error("Failed to fetch evidence:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const filteredByFilter = evidenceList.filter((e) =>
    filter === "all" || e.importance === filter
  );

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
          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {(["all", "High", "Medium", "Low"] as ImportanceFilter[]).map((imp) => (
                <button
                  key={imp}
                  onClick={() => { setFilter(imp); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filter === imp
                      ? imp === "High"
                        ? "bg-red-900/50 text-red-400 ring-1 ring-red-400"
                        : imp === "Medium"
                        ? "bg-yellow-900/50 text-yellow-400 ring-1 ring-yellow-400"
                        : imp === "Low"
                        ? "bg-gray-700 text-gray-400 ring-1 ring-gray-400"
                        : "bg-violet-900/50 text-violet-400 ring-1 ring-violet-400"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                  }`}
                >
                  {imp === "all" ? "All" : imp}
                </button>
              ))}
            </div>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              Page {page}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={{ color: "var(--muted)" }}>
              {filteredByFilter.length} {filteredByFilter.length === 1 ? "clue" : "clues"}{filter !== "all" ? ` (${filter})` : ""}
            </h2>
            <span className="text-sm" style={{ color: "var(--muted)" }}>Sorted by newest</span>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8" style={{ color: "var(--muted)" }}>
                Loading evidence...
              </div>
            ) : evidenceList.length > 0 ? (
              <>
                {evidenceList.map((evidence) => (
                  <EvidenceCard key={evidence.id} evidence={evidence} />
                ))}

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800/50 transition-colors"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      color: page === 1 ? "var(--muted)" : "var(--foreground)",
                    }}
                  >
                    ← Previous
                  </button>
                  <span className="text-sm" style={{ color: "var(--muted)" }}>
                    Page {page}
                  </span>
                  <button
                    onClick={() => { setPage((p) => p + 1); fetchEvidence(); }}
                    disabled={evidenceList.length < pageSize}
                    className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800/50 transition-colors"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      color: evidenceList.length < pageSize ? "var(--muted)" : "var(--foreground)",
                    }}
                  >
                    Next →
                  </button>
                </div>
              {/* Ad Banner */}
                <BannerRectangle className="mt-8" />
              </>
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
