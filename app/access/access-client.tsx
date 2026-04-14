"use client";

import Link from "next/link";
import { Card } from "@/components/card";
import { NativeBanner } from "@/components/adsterra-ads";

const steps = [
  {
    number: "01",
    title: "Create an OpenRouter Account",
    description: "Visit openrouter.ai and sign up for a free account. You can sign in using your Google, GitHub, or email account.",
    tip: "OpenRouter is a platform that provides access to various AI models, including Hunter Alpha.",
  },
  {
    number: "02",
    title: "Navigate to Hunter Alpha",
    description: "Once logged in, use the search function to find 'Hunter Alpha' or browse the model catalog. Click on the model to access its chat interface.",
    tip: "You can also access Hunter Alpha directly via its model page on OpenRouter.",
  },
  {
    number: "03",
    title: "Start Chatting",
    description: "Hunter Alpha is currently free to use. Simply type your message in the chat box and send. The model supports up to 1M tokens of context, so you can have lengthy conversations.",
    tip: "Try asking about its identity or testing its roleplay capabilities!",
  },
  {
    number: "04",
    title: "Share Your Experience",
    description: "Have an interesting experience with Hunter Alpha? Share your findings on our Evidence Wall to help the community. Every observation counts!",
    tip: "Include screenshots or copy-paste interesting responses for better evidence.",
  },
];

export default function AccessClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">How to Access Hunter Alpha</span>
        </h1>
        <p className="max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Step-by-step guide to start using Hunter Alpha (Xiaomi mimo-v2) on OpenRouter
        </p>
        <p className="mt-4 text-sm px-4 py-2 rounded-lg inline-block border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          ✓ Identity confirmed: Hunter Alpha = Xiaomi mimo-v2
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-violet-400 mb-1">Free</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>Current Price</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-teal-400 mb-1">1M</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>Context Window</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-pink-400 mb-1">Text</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>Text-only Model</div>
        </Card>
      </div>

      {/* Native Banner Ad - After Quick Info Cards */}
      <NativeBanner />

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <Card key={index} className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-violet-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                {step.number}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3" style={{ color: "var(--foreground)" }}>
                  {step.title}
                </h2>
                <p className="mb-4" style={{ color: "var(--muted)" }}>
                  {step.description}
                </p>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-violet-300">
                    <span className="font-medium">Tip: </span>
                    {step.tip}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Card className="p-8 glow-border">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Exploring?</h2>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            After trying Hunter Alpha, share your experience with the community.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/evidence"
              className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-violet-500 to-teal-500 text-white hover:from-violet-600 hover:to-teal-600 transition-colors"
            >
              Submit Evidence
            </Link>
            <a
              href="https://openrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-medium border border-violet-500 text-violet-400 hover:bg-violet-500/10 transition-colors"
            >
              Open OpenRouter
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}