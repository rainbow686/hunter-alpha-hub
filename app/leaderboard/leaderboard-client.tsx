"use client";

import Link from "next/link";
import { Leaderboard } from "@/components/leaderboard";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";

export default function LeaderboardClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Contributor Leaderboard</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Top detectives investigating the Hunter Alpha mystery. Submit evidence, earn likes, and climb the ranks!
        </p>
      </div>

      {/* Rewards Info */}
      <Card className="p-6 mb-8" >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-teal-500/20">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
              Earn Badges & Recognition
            </h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Submit evidence to earn badges like <span className="text-violet-400">First Clue</span>, <span className="text-violet-400">Detective</span>, <span className="text-violet-400">Expert Investigator</span>, and more. High importance evidence earns the <span className="text-red-400">🔥 High Impact</span> badge!
            </p>
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <Leaderboard />

      {/* Native Banner Ad */}
      <NativeBanner />

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-lg mb-4" style={{ color: "var(--muted)" }}>
          Want to join the investigation?
        </p>
        <Link
          href="/evidence"
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Submit Evidence
        </Link>
      </div>
    </div>
  );
}
