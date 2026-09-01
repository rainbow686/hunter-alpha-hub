import Link from "next/link";
import {
  formatContextWindow,
  formatPrice,
  openrouterModelUrl,
  type HubModel,
} from "@/lib/openrouter-models";

interface ModelTableProps {
  models?: HubModel[];
  showFormerAlias?: boolean;
}

export function ModelTable({ models, showFormerAlias = true }: ModelTableProps) {
  const rows = models ?? [];
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y" style={{ borderColor: "var(--card-border)" }}>
        <thead>
          <tr>
            {["Model", "Provider", "Context", "Input / Output / 1M", "Modalities", "Best for"].map((heading) => (
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
          {rows.map((model) => (
            <tr key={model.id}>
              <td className="px-3 py-4 align-top">
                <div className="font-medium" style={{ color: "var(--foreground)" }}>
                  {model.name}
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {model.id}
                </div>
                {showFormerAlias && model.formerAlias && (
                  <div className="mt-1 text-xs text-amber-300">formerly {model.formerAlias}</div>
                )}
              </td>
              <td className="px-3 py-4 text-sm align-top" style={{ color: "var(--muted)" }}>
                {model.vendor}
              </td>
              <td className="px-3 py-4 text-sm align-top" style={{ color: "var(--foreground)" }}>
                {formatContextWindow(model.contextWindow)}
              </td>
              <td className="px-3 py-4 text-sm font-mono align-top" style={{ color: "var(--foreground)" }}>
                {formatPrice(model.inputPricePerMillion)} / {formatPrice(model.outputPricePerMillion)}
              </td>
              <td className="px-3 py-4 text-sm align-top" style={{ color: "var(--muted)" }}>
                {model.modalities.join(", ")}
              </td>
              <td className="px-3 py-4 text-sm align-top" style={{ color: "var(--muted)" }}>
                {model.bestFor.join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OpenRouterModelLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a
      href={openrouterModelUrl(id)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-violet-400 hover:text-violet-300 transition-colors"
    >
      {children}
    </a>
  );
}
