"use client";

import { ComponentProps, MouseEvent, ReactNode } from "react";
import { trackOutboundOpenRouterClick } from "@/lib/gtag";

interface OutboundOpenRouterLinkProps extends ComponentProps<"a"> {
  children: ReactNode;
  modelId?: string;
  trackingLocation: string;
}

export function OutboundOpenRouterLink({
  children,
  href,
  modelId,
  trackingLocation,
  onClick,
  ...props
}: OutboundOpenRouterLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackOutboundOpenRouterClick({
      model_id: modelId,
      target_url: href?.toString() ?? "https://openrouter.ai",
      location: trackingLocation,
    });
    onClick?.(event);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
