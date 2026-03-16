"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function NewbieGuide() {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // 检查是否已经显示过
    const hasShown = localStorage.getItem("hunter-alpha-newbie-guide-shown");
    if (!hasShown) {
      // 延迟 1 秒显示，让用户先浏览页面
      const timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem("hunter-alpha-newbie-guide-shown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hunter-alpha-newbie-guide-shown", "true");
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-teal-500/20">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                Welcome to Hunter Alpha Hub
              </h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Your guide to solving the AI mystery
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What is Hunter Alpha */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold">1</span>
              What is Hunter Alpha?
            </h3>
            <div className="ml-8 space-y-2" style={{ color: "var(--muted)" }}>
              <p>
                Hunter Alpha is a mysterious <strong className="text-violet-400">1 Trillion parameter AI model</strong> with an unprecedented <strong className="text-violet-400">1M token context window</strong>.
              </p>
              <p>
                Discovered on OpenRouter in March 2026, its identity remains unknown. Some believe it&apos;s a breakthrough from a major lab, others think it&apos;s an open-source achievement.
              </p>
            </div>
          </section>

          {/* Site Features */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold">2</span>
              Explore This Site
            </h3>
            <div className="ml-8 grid md:grid-cols-2 gap-3">
              <FeatureCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title="Evidence Wall"
                description="Browse and submit clues about Hunter Alpha&apos;s identity"
                link="/evidence"
              />
              <FeatureCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Monitor"
                description="Real-time status and specs from OpenRouter API"
                link="/monitor"
              />
              <FeatureCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="FAQ"
                description="Answers to common questions about Hunter Alpha"
                link="/faq"
              />
              <FeatureCard
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Timeline"
                description="Key events in the Hunter Alpha mystery"
                link="/timeline"
              />
            </div>
          </section>

          {/* How to Participate */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold">3</span>
              Join the Investigation
            </h3>
            <div className="ml-8 space-y-3">
              <StepItem
                step="Submit Evidence"
                description="Found a clue? Share it on the Evidence Wall"
              />
              <StepItem
                step="Discuss Theories"
                description="Join discussions on Reddit or Twitter"
              />
              <StepItem
                step="Stay Updated"
                description="Subscribe to get notified when Hunter Alpha&apos;s identity is revealed"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex items-center justify-between"
          style={{ borderColor: "var(--card-border)" }}
        >
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--muted)" }}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-gray-700 bg-gray-800 text-violet-500 focus:ring-violet-500"
            />
            Don&apos;t show this again
          </label>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gradient-to-r from-violet-500 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="p-4 rounded-lg border transition-colors hover:border-violet-500/50"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-violet-400">{icon}</div>
        <div>
          <h4 className="font-medium mb-1" style={{ color: "var(--foreground)" }}>{title}</h4>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{description}</p>
        </div>
      </div>
    </Link>
  );
}

function StepItem({ step, description }: { step: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <div>
        <p className="font-medium" style={{ color: "var(--foreground)" }}>{step}</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{description}</p>
      </div>
    </div>
  );
}
