/**
 * GSC keyword grouping — RAINBOW686-12
 * Centralizes Search Console keyword groups so GA4, /api/stats, and SEO docs stay consistent.
 * Real GSC data comes from Google Search Console API; this file defines the GROUPING logic.
 */

export type KeywordGroupId = "ox_alpha" | "hunter_alpha" | "comparison" | "other";

export interface KeywordPattern {
  group: KeywordGroupId;
  label: string;          // human-readable group name
  patterns: RegExp[];     // matching rules (case-insensitive)
  examples: string[];     // representative queries for docs/validation
  description: string;
}

/**
 * OX Alpha is the growth lever (2026-08-20 window). All OX-related queries roll up here.
 * Keep patterns loose: captures "ox alpha", "ox-alpha", "oxalpha", variations with "what is" / "vs"
 */
export const keywordGroups: KeywordPattern[] = [
  {
    group: "ox_alpha",
    label: "OX Alpha",
    patterns: [
      /ox[\s\-_]*alpha/i,               // ox alpha, ox-alpha, ox_alpha, oxalpha
      /\box[\s\-]*a\b/i,                // unlikely but captures truncated
      /what\s+is\s+ox/i,                // what is ox alpha ai
    ],
    examples: [
      "ox alpha",
      "ox-alpha",
      "oxalpha",
      "what is ox alpha ai",
      "what is OX-alpha AI?",
      "ox alpha openrouter",
      "ox alpha mystery model",
    ],
    description: "All OX-Alpha discovery queries. Primary growth KPI for Phase1 gate.",
  },
  {
    group: "hunter_alpha",
    label: "Hunter Alpha / mimo-v2",
    patterns: [
      /hunter[\s\-_]*alpha/i,
      /mimo[\s\-_]*v2/i,
      /xiaomi[\s\-_]*mimo/i,
    ],
    examples: [
      "hunter alpha",
      "hunter alpha ai",
      "hunter alpha model",
      "xiaomi mimo v2",
      "hunter alpha openrouter",
    ],
    description: "Legacy Hunter Alpha + post-reveal mimo-v2 branded queries. Baseline/retention group.",
  },
  {
    group: "comparison",
    label: "OX Alpha vs Hunter Alpha",
    patterns: [
      /ox[\s\-_]*alpha.*hunter[\s\-_]*alpha/i,
      /hunter[\s\-_]*alpha.*ox[\s\-_]*alpha/i,
      /ox[\s\-_]*alpha\s+vs/i,
    ],
    examples: [
      "ox alpha vs hunter alpha",
      "ox alpha vs hunter alpha ai",
      "hunter alpha vs ox alpha",
      "compare ox alpha hunter alpha",
    ],
    description: "Direct comparison intent — highest commercial / tracker intent. Captures /ox-alpha-vs-hunter-alpha/ page.",
  },
];

export function classifyKeyword(query: string): KeywordGroupId {
  const q = query.trim().toLowerCase();
  for (const g of keywordGroups) {
    if (g.patterns.some((re) => re.test(q))) {
      // comparison must win when both present; order above ensures ox_alpha matches first,
      // so re-check comparison explicitly before returning ox_alpha.
      if (g.group === "ox_alpha" && /hunter/.test(q) && /ox/.test(q)) {
        return "comparison";
      }
      return g.group;
    }
  }
  return "other";
}

/**
 * Stop-loss gate defined in RAINBOW686-12
 * - Any single target keyword >200/mo → trigger Phase1 (build /ox-alpha + homepage upgrade)
 * - All <200/mo → pause Phase1, keep Hunter Alpha long-tail
 */
export const stopLossKeywords = [
  "ox alpha",
  "what is ox alpha ai",
  "ox alpha vs hunter alpha",
] as const;

export type StopLossKeyword = typeof stopLossKeywords[number];

export interface StopLossVolume {
  keyword: StopLossKeyword;
  volume: number | null;  // null = not yet checked (manual Planner step)
  source: "keyword_planner" | "gsc" | "manual";
  checkedAt?: string;
}

export interface StopLossDecision {
  shouldTriggerPhase1: boolean;
  triggeredBy: StopLossKeyword[];
  allBelowThreshold: boolean;
  threshold: number;
  summary: string;
}

export const STOP_LOSS_THRESHOLD = 200;

export function evaluateStopLoss(volumes: StopLossVolume[]): StopLossDecision {
  const threshold = STOP_LOSS_THRESHOLD;
  const triggeredBy = volumes.filter((v) => (v.volume ?? 0) > threshold).map((v) => v.keyword);
  const allBelowThreshold = volumes.every((v) => v.volume !== null && v.volume < threshold);
  const hasAnyData = volumes.some((v) => v.volume !== null);
  // If no data yet, do not trigger — wait for manual Planner check
  const shouldTriggerPhase1 = hasAnyData && triggeredBy.length > 0;
  const summary = !hasAnyData
    ? "Awaiting Keyword Planner volumes (manual step by 孙斌)"
    : shouldTriggerPhase1
      ? `GO Phase1 — ${triggeredBy.join(", ")} >${threshold}/mo`
      : allBelowThreshold
        ? `PAUSE Phase1 — all <${threshold}/mo, keep Hunter Alpha long-tail`
        : "Partial data — awaiting remaining keywords";
  return { shouldTriggerPhase1, triggeredBy, allBelowThreshold, threshold, summary };
}

/**
 * For /api/stats: shapes the OX-Alpha dimension.
 * GSC live data should be merged here when Search Console API is wired (see docs/GSC-OX-Alpha-Setup.md).
 */
export function getOxAlphaDimensionMeta() {
  return {
    windowStart: "2026-08-20",
    trendsRef: { oxAlpha: 47, gpts: 30, upliftPct: 56, peak: 100, peakDate: "2026-08-22" },
    groups: keywordGroups.map((g) => ({
      id: g.group,
      label: g.label,
      examples: g.examples.slice(0, 3),
      description: g.description,
    })),
    stopLoss: {
      threshold: STOP_LOSS_THRESHOLD,
      keywords: [...stopLossKeywords],
      rule: "Any >200/mo → Phase1 GO; all <200 → PAUSE",
    },
  };
}
