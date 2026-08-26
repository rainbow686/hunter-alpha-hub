"use client";

import { useEffect } from "react";
import { trackOxAlphaView } from "@/lib/gtag";

/**
 * Fires ox_alpha_view once per mount.
 * Drop into /ox-alpha/page.tsx or any OX-Alpha teaser component.
 * Example:
 *   <OxAlphaTracker source="ox_alpha_page" />
 */
export function OxAlphaTracker({ source = "direct" }: { source?: string }) {
  useEffect(() => {
    trackOxAlphaView({ source });
  }, [source]);
  return null;
}
