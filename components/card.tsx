import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur ${
        glow ? "glow-border" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
