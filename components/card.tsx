import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className = "", glow = false, style }: CardProps) {
  return (
    <div
      className={`backdrop-blur rounded-lg transition-colors ${
        glow ? "glow-border" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
