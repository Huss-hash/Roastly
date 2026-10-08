"use client";

import { useState } from "react";
import { RoastForm } from "@/components/RoastForm";
import { RoastResult } from "@/components/RoastResult";
import { RoastData } from "@/lib/parseRoast";

export default function Home() {
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Header / Branding */}
      <div className="w-full text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-accent2 shadow-sm">
          <span>🔥</span>
          <span>AI Landing Page Critic & Clarity Auditor</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Roastly<span className="text-accent">.</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto font-normal">
          Drop your URL. Get roasted. Fix it in 10 minutes.
        </p>
      </div>

      {/* Main Form or Result Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-4">
        {roastData ? (
          <RoastResult
            data={roastData}
            onReset={() => {
              setRoastData(null);
            }}
          />
        ) : (
          <RoastForm
            onRoastSuccess={(data) => setRoastData(data)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-zinc-600 space-y-2">
        <p>
          Powered by Nvidia NIM & Meta Llama 3.3 • Designed for high-converting landing pages.
        </p>
        <p>© {new Date().getFullYear()} Roastly. All rights reserved.</p>
      </footer>
    </main>
  );
}
