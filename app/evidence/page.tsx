import { Card } from "@/components/card";
import { EvidenceForm } from "@/components/evidence-form";
import { EvidenceCard } from "@/components/evidence-card";
import { readEvidence } from "@/lib/data";

export default function EvidencePage() {
  const evidenceList = readEvidence();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Evidence Wall</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Submit and browse community-sourced evidence about Hunter Alpha.
          Each clue brings us closer to solving the mystery.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Submit Form */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Submit Evidence</h2>
            <EvidenceForm />
          </Card>
        </div>

        {/* Evidence List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-300">
              {evidenceList.length} {evidenceList.length === 1 ? "clue" : "clues"} submitted
            </h2>
            <span className="text-sm text-gray-500">Sorted by newest</span>
          </div>

          <div className="grid gap-4">
            {evidenceList.length > 0 ? (
              evidenceList.map((evidence) => (
                <EvidenceCard key={evidence.id} evidence={evidence} />
              ))
            ) : (
              <Card className="p-8 text-center text-gray-400">
                No evidence yet. Submit the first clue!
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
