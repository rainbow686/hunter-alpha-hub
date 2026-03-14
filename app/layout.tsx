import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Hunter Alpha Hub - Tracking the Identity Mystery",
  description: "Third-party tracking site for Hunter Alpha model. Submit evidence, track status, and be notified when the identity is revealed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
