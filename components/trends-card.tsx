import Image from "next/image";

export function TrendsCardPreview() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-teal-400">1200×630 — OG / X horizontal</p>
        <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/social/trends-ox-alpha-1200x630.svg" alt="OX-Alpha vs GPTs Trends 1200x630" width={1200} height={630} className="w-full h-auto" />
        </div>
        <a href="/social/trends-ox-alpha-1200x630.svg" download className="inline-flex text-sm text-teal-400 hover:underline">Download SVG ↓</a>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-violet-400">1080×1080 — X / Reddit square</p>
        <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/social/trends-ox-alpha-1080x1080.svg" alt="OX-Alpha vs GPTs Trends 1080x1080" width={1080} height={1080} className="w-full h-auto" />
        </div>
        <a href="/social/trends-ox-alpha-1080x1080.svg" download className="inline-flex text-sm text-violet-400 hover:underline">Download SVG ↓</a>
      </div>
    </div>
  );
}

export function TrendsDataTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/60 text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">Metric</th>
            <th className="px-4 py-3 text-left">OX-Alpha</th>
            <th className="px-4 py-3 text-left">GPTs</th>
            <th className="px-4 py-3 text-left">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          <tr><td className="px-4 py-3 font-semibold">7-day avg (Trends)</td><td className="px-4 py-3 text-teal-400 font-bold">47</td><td className="px-4 py-3">30</td><td className="px-4 py-3 text-gray-400">+56% breakout</td></tr>
          <tr><td className="px-4 py-3 font-semibold">Peak 2026-08-22</td><td className="px-4 py-3 text-teal-400 font-bold">100</td><td className="px-4 py-3">~32</td><td className="px-4 py-3 text-gray-400">Breakout day 08/21</td></tr>
          <tr><td className="px-4 py-3 font-semibold">Platform</td><td className="px-4 py-3">OpenRouter (mystery)</td><td className="px-4 py-3">OpenAI</td><td className="px-4 py-3 text-gray-400">Free vs paid</td></tr>
          <tr><td className="px-4 py-3 font-semibold">Context</td><td className="px-4 py-3">1M tokens</td><td className="px-4 py-3">128k</td><td className="px-4 py-3 text-gray-400">Hunter Alpha memo</td></tr>
        </tbody>
      </table>
    </div>
  );
}
