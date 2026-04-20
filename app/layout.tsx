import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ethiotelecom Issue Tracker",
  description: "Issue tracking system for Ethiotelecom",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          {/* 🔥 FLEX LAYOUT FIX */}
          <div className="flex">
            {/* SIDEBAR SPACE (IMPORTANT) */}
            <div className="w-64 shrink-0" />

            {/* MAIN CONTENT */}
            <main className="flex-1 min-h-screen">{children}</main>
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
