"use client";

import { useMemo, useState } from "react";
import {
  formatPrice,
  openrouterModels,
  type HubModel,
} from "@/lib/openrouter-models";

export function PricingCalculator() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "xiaomi/mimo-v2.5",
    "z-ai/glm-5.3-flash",
    "anthropic/claude-sonnet-5",
    "openai/gpt-5.6-luna",
  ]);
  const [monthlyTokens, setMonthlyTokens] = useState(10_000_000);
  const [inputShare, setInputShare] = useState(80);

  const models = useMemo(
    () => openrouterModels.filter((model: HubModel) => selectedIds.includes(model.id)),
    [selectedIds],
  );

  const inputTokens = Math.round(monthlyTokens * (inputShare / 100));
  const outputTokens = Math.max(0, monthlyTokens - inputTokens);

  const results = models.map((model) => {
    const inputCost = (inputTokens / 1_000_000) * model.inputPricePerMillion;
    const outputCost = (outputTokens / 1_000_000) * model.outputPricePerMillion;
    return {
      model,
      inputCost,
      outputCost,
      total: inputCost + outputCost,
    };
  });

  const cheapest = results.reduce(
    (best, current) => (current.total < best.total ? current : best),
    results[0] ?? { total: 0, model: null, inputCost: 0, outputCost: 0 },
  );

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm font-medium mb-2 block" style={{ color: "var(--muted)" }}>
            Monthly tokens
          </span>
          <input
            type="number"
            min={0}
            step={100_000}
            value={monthlyTokens}
            onChange={(event) => setMonthlyTokens(Math.max(0, Number(event.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium mb-2 block" style={{ color: "var(--muted)" }}>
            Input share
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={inputShare}
            onChange={(event) => setInputShare(Number(event.target.value))}
            className="w-full"
          />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {inputShare}% input / {100 - inputShare}% output
          </span>
        </label>

        <div className="text-sm" style={{ color: "var(--muted)" }}>
          <span className="font-medium mb-2 block">Models</span>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {openrouterModels.map((model) => (
              <label key={model.id} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(model.id)}
                  onChange={(event) => {
                    setSelectedIds((current) =>
                      event.target.checked
                        ? [...current, model.id]
                        : current.filter((id) => id !== model.id),
                    );
                  }}
                />
                <span>{model.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
          <thead>
            <tr>
              {["Model", "Input", "Output", "Monthly total"].map((heading) => (
                <th
                  key={heading}
                  className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--muted)" }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--card-border)" }}>
            {results.map((result) => (
              <tr key={result.model.id}>
                <td className="px-3 py-4 font-medium" style={{ color: "var(--foreground)" }}>
                  {result.model.name}
                  {result.model.formerAlias && (
                    <span className="ml-2 text-xs text-amber-300">
                      formerly {result.model.formerAlias}
                    </span>
                  )}
                </td>
                <td className="px-3 py-4 font-mono text-sm" style={{ color: "var(--foreground)" }}>
                  ${result.inputCost.toFixed(2)}
                </td>
                <td className="px-3 py-4 font-mono text-sm" style={{ color: "var(--foreground)" }}>
                  ${result.outputCost.toFixed(2)}
                </td>
                <td className="px-3 py-4 font-mono text-sm font-bold" style={{ color: "var(--foreground)" }}>
                  ${result.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm" style={{ color: "var(--muted)" }}>
        At {monthlyTokens.toLocaleString()} tokens/month ({inputShare}% input),{" "}
        <span className="font-semibold" style={{ color: "var(--foreground)" }}>
          {cheapest.model?.name ?? "your selected model"}
        </span>{" "}
        is the lowest-cost option at {formatPrice(cheapest.total ?? 0)}.
      </p>
    </div>
  );
}
