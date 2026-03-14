import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Hunter Alpha Hub - Tracking the Identity Mystery",
  description: "Third-party tracking site for Hunter Alpha AI model. Submit evidence, track real-time status, view specifications, and be notified when the identity is revealed.",
  keywords: ["Hunter Alpha", "AI model", "OpenRouter", "LLM", "AI mystery", "Hunter Hub"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
