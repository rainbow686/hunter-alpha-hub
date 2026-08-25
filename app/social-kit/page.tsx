import { Metadata } from "next";
import { TrendsCardPreview, TrendsDataTable } from "@/components/trends-card";

export const metadata: Metadata = {
  title: "Social Kit — OX-Alpha Trends Cards",
  description: "Download OX-Alpha vs GPTs Trends cards for X, Reddit r/LocalLLaMA, V2EX. Pre-built copy for r/Futurology value reply.",
  alternates: { canonical: "https://www.hunteralphahub.com/social-kit" },
  openGraph: {
    title: "OX-Alpha Social Kit — Trends Cards + Copy",
    description: "Download Trends comparison cards + copy for X / Reddit / V2EX. Track OX-Alpha mystery model.",
    type: "website",
  },
};

export default function SocialKitPage() {
  const xCopy = `OX-Alpha just flipped GPTs on Google Trends — 47 vs 30 (+56%), peak 100 on Aug 22.\n\nThe latest OpenRouter mystery model (1M context, free) is breaking out. We tracked specs, timeline & how to access:\n\n→ hunteralphahub.com/ox-alpha?utm_source=x&utm_medium=social&utm_campaign=ox_alpha_trends\n\n#OpenRouter #OXalpha #AI`;

  const redditCopy = `Title: [Trends] OX-Alpha (OpenRouter mystery) just overtook GPTs — 47 vs 30 avg, peak 100 on Aug 22\n\nBody:\nSpotted this on Google Trends — OX-Alpha averaged 47 vs GPTs 30 over the last 7 days (+56%), with a 100 peak on Aug 22. Breakout was Aug 21.\n\nContext if you're not following:\n- OX-Alpha is the current unnamed/mystery model on OpenRouter (1M context, free while available)\n- Previous mystery was Hunter Alpha → revealed as Xiaomi mimo-v2 (1T params)\n- Specs are still speculative, but OpenRouter lists 1M context window\n\nI put together a tracker with timeline, benchmark table, community speculation (with Business Insider/Quartz quotes + Reddit links), and a 5-step how-to-access guide:\n\nhttps://www.hunteralphahub.com/ox-alpha?utm_source=reddit&utm_medium=social&utm_campaign=ox_alpha_trends\n\nComparison vs Hunter Alpha also here: https://www.hunteralphahub.com/ox-alpha-vs-hunter-alpha\n\nHappy to answer Qs — tracking daily. What's your theory on the base model?`;

  const v2exCopy = `标题: [分享] OpenRouter 神秘模型 OX-Alpha 热度反超 GPTs — 趋势 47 vs 30，峰值 100\n\n内容:\n最近 Google Trends 上 OX-Alpha 7 日均值 47，反超 GPTs 的 30（+56%），8月22日冲到峰值 100，爆发点是 8/21。\n\n背景:\n- OX-Alpha 是 OpenRouter 上最新的匿名模型，1M 上下文，限时免费\n- 上一个神秘模型 Hunter Alpha 已确认为小米 mimo-v2（1T 参数）\n- 目前规格仍是推测，官方仅确认 1M context\n\n我做了个追踪页，含时间线、参数对比表、社区推测（引 Business Insider/Quartz 原话+Reddit 讨论）、5 步接入教程：\n\nhttps://www.hunteralphahub.com/ox-alpha?utm_source=v2ex&utm_medium=social&utm_campaign=ox_alpha_trends\n\n对比页: https://www.hunteralphahub.com/ox-alpha-vs-hunter-alpha\n\n欢迎讨论，觉得会是哪个厂的马甲？`;

  const futurologyReply = `Great thread — on the mystery-model angle, OX-Alpha is the current one to watch on OpenRouter.\n\nGoogle Trends last 7d: OX-Alpha 47 vs GPTs 30 avg (+56%), peak 100 on Aug 22, breakout Aug 21. Previous mystery Hunter Alpha was revealed as Xiaomi mimo-v2 (1T params, 1M context).\n\nWe put together a non-hype tracker that separates known facts vs speculation, with primary sources (Business Insider/Quartz quotes + Reddit aggregation) and a short how to try it free on OpenRouter:\n\n→ https://www.hunteralphahub.com/ox-alpha?utm_source=reddit&utm_medium=comment&utm_campaign=ox_alpha_trends\n\nComparison table vs Hunter Alpha: https://www.hunteralphahub.com/ox-alpha-vs-hunter-alpha\n\nHappy to share the raw Trends export if anyone wants to replicate. Curious what this community thinks the base model is — Qwen? DeepSeek?`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-3">
          <p className="text-sm tracking-widest text-violet-400 font-semibold">RAINBOW686-16 • SOCIAL KIT</p>
          <h1 className="text-3xl md:text-4xl font-black">OX-Alpha Trends — Social & Directory Kit</h1>
          <p className="text-gray-400 max-w-3xl">One page to ship all P2 deliverables: Trends cards for X / r/LocalLLaMA / V2EX, value reply for r/Futurology, and directory submission pack for aitools.fyi & theresanaiforthat. All links carry UTM for GA verification.</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">Direct 75% → second pass</span>
            <span className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">Goal: +500 UV week 1</span>
            <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">No paid backlinks</span>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">1. Trends Cards — download & post</h2>
          <p className="text-sm text-gray-400">Post same card with native copy per platform. Attach card as image. Link with UTM.</p>
          <TrendsCardPreview />
          <TrendsDataTable />
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-200">
            <strong>Posting order:</strong> X → Reddit r/LocalLLaMA → V2EX (30min apart). Keep title factual, no clickbait. Image alt: “Google Trends OX-Alpha 47 vs GPTs 30, peak 100 Aug 22”.
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Copy Pack — one-click</h2>
          <div className="grid gap-6">
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-2">
              <h3 className="font-bold text-white">X (280 chars + image)</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-900 rounded-lg p-4 border border-gray-700">{xCopy}</pre>
              <p className="text-xs text-gray-500">Hashtags: #OpenRouter #OXalpha #AI — attach 1200×630 card.</p>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-2">
              <h3 className="font-bold text-white">Reddit r/LocalLLaMA</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-900 rounded-lg p-4 border border-gray-700">{redditCopy}</pre>
              <p className="text-xs text-gray-500">Flair: Discussion. Attach 1080×1080 card. Reply to first comment with Trends CSV link.</p>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-2">
              <h3 className="font-bold text-white">V2EX</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-900 rounded-lg p-4 border border-gray-700">{v2exCopy}</pre>
              <p className="text-xs text-gray-500">Node: share / AI. Title prefix [分享] required. Attach 1200×630.</p>
            </div>
            <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-5 space-y-2">
              <h3 className="font-bold text-teal-300">r/Futurology — value reply (not a post)</h3>
              <p className="text-xs text-teal-200/70">Find the most-upvoted OX-Alpha / OpenRouter / AI mystery thread from last 7 days, reply as valuable comment with link, aim &gt;10 upvotes, not deleted. Template below is non-ad, source-first.</p>
              <pre className="whitespace-pre-wrap text-sm text-gray-100 bg-gray-900 rounded-lg p-4 border border-teal-500/20">{futurologyReply}</pre>
              <ul className="text-xs text-gray-400 list-disc pl-5 space-y-1">
                <li>Search r/Futurology: “AI model” “OpenRouter” sorted by top/week</li>
                <li>Do NOT post as standalone submission — comment only</li>
                <li>After posting, self-upvote once, then engage with 2 replies within 2h</li>
                <li>If mod removes, repost with shorter link (remove UTM, keep canonical)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Directory Submission Pack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-3">
              <h3 className="font-bold">aitools.fyi</h3>
              <p className="text-xs text-gray-500">Submit: https://aitools.fyi/submit — free tier</p>
              <dl className="text-sm space-y-2">
                <div><dt className="text-gray-500">Name</dt><dd className="text-white font-semibold">Hunter Alpha Hub — OX-Alpha Tracker</dd></div>
                <div><dt className="text-gray-500">URL</dt><dd className="text-teal-400">https://www.hunteralphahub.com/ox-alpha</dd></div>
                <div><dt className="text-gray-500">Tagline (60c)</dt><dd className="text-white">Track OX-Alpha, the OpenRouter mystery model (1M context)</dd></div>
                <div><dt className="text-gray-500">Description (150c)</dt><dd className="text-gray-300">OpenRouter mystery model tracker: OX-Alpha specs, timeline, benchmark vs Hunter Alpha (Xiaomi mimo-v2), community speculation with primary sources, and free access guide. Updated daily.</dd></div>
                <div><dt className="text-gray-500">Category</dt><dd>AI Aggregator / LLM Tracker</dd></div>
                <div><dt className="text-gray-500">Pricing</dt><dd>Free</dd></div>
              </dl>
            </div>
            <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-5 space-y-3">
              <h3 className="font-bold">theresanaiforthat.com</h3>
              <p className="text-xs text-gray-500">Submit: https://theresanaiforthat.com/submit/ — free</p>
              <dl className="text-sm space-y-2">
                <div><dt className="text-gray-500">Name</dt><dd className="text-white font-semibold">Hunter Alpha Hub</dd></div>
                <div><dt className="text-gray-500">URL</dt><dd className="text-teal-400">https://www.hunteralphahub.com</dd></div>
                <div><dt className="text-gray-500">Tagline</dt><dd className="text-white">Mystery AI Model Tracker for OpenRouter</dd></div>
                <div><dt className="text-gray-500">Description</dt><dd className="text-gray-300">Follow OX-Alpha and Hunter Alpha (Xiaomi mimo-v2): 1M context, 1T params, evidence wall, real-time status, timeline since gpt2-chatbot. Free tracker for the OpenRouter mystery era.</dd></div>
                <div><dt className="text-gray-500">Category</dt><dd>AI Tools / Research</dd></div>
                <div><dt className="text-gray-500">Pricing</dt><dd>Free — Freemium (OpenRouter free tier)</dd></div>
              </dl>
            </div>
          </div>
          <div className="rounded-xl bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-300">
            <strong className="text-white">After submit:</strong> screenshot confirmation + forward to group. Expect 2-7 day review. Save email for verification (Ahrefs + GA referral). Templates already in <code className="text-teal-400">docs/growth/</code>.
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. Verification — how to prove it</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl border border-gray-700 p-4 bg-gray-800/30">
              <h4 className="font-bold text-white">GA — Social sources</h4>
              <p className="text-gray-400 mt-1">GA4 → Reports → Acquisition → Traffic acquisition. Filter Session source = x / reddit / v2ex. UTM already appended. Also DebugView events: <code className="text-teal-400">ox_alpha_view</code>.</p>
            </div>
            <div className="rounded-xl border border-gray-700 p-4 bg-gray-800/30">
              <h4 className="font-bold text-white">Ahrefs — new backlinks</h4>
              <p className="text-gray-400 mt-1">Site Explorer → hunteralphahub.com → Backlinks → New. Expect Reddit/V2EX + 2 directory domains within 14d.</p>
            </div>
            <div className="rounded-xl border border-gray-700 p-4 bg-gray-800/30">
              <h4 className="font-bold text-white">Email proof</h4>
              <p className="text-gray-400 mt-1">Screenshot aitools.fyi + theresanaiforthat confirmation (auto-reply counts). Save to <code className="text-teal-400">docs/growth/</code> for audit.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Stop-loss: if all 3 keywords &lt;200/mo (GSC/Planner), pause Stage 2. Social still ships — it’s sunk cost low and feeds Direct.</p>
        </section>

        <div className="pt-6 border-t border-gray-800 text-xs text-gray-500">
          Built by Guillermo Rauch • Stage 3 • RAINBOW686-16 • All copy is non-hype, source-first, per 哥飞 “速度+内容 &gt; 外链”.
        </div>
      </div>
    </div>
  );
}
