import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Stepper from "../components/Stepper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brain SLI Lifecycle — PR Workflow",
  description: "PR-style SLI update workflow for Azure Brain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-100 min-h-screen`}>
        <header className="bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-3 px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">B</div>
              <span className="text-lg font-semibold text-slate-100">Brain</span>
              <span className="text-slate-500 text-sm ml-1">SLI Lifecycle</span>
            </div>
          </div>
          <Stepper />
        </header>
        <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
