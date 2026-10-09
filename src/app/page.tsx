"use client";

import { useState, useEffect } from "react";
import { RoastForm } from "@/components/RoastForm";
import { RoastResult } from "@/components/RoastResult";
import { RoastData } from "@/lib/parseRoast";
import { decodeRoastFromHash } from "@/lib/share";

export default function Home() {
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [targetRoasted, setTargetRoasted] = useState<string | undefined>();
  const [isSharedView, setIsSharedView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const shareHash = params.get("r");
      if (shareHash) {
        const decoded = decodeRoastFromHash(shareHash);
        if (decoded) {
          setRoastData(decoded.data);
          setTargetRoasted(decoded.target);
          setIsSharedView(true);
        }
      }
    }
  }, []);

  const handleReset = () => {
    setRoastData(null);
    setTargetRoasted(undefined);
    setIsSharedView(false);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

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

        {isSharedView && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-600/50 text-xs font-semibold text-amber-300">
            <span>👀</span>
            <span>You are viewing a shared roast.</span>
            <button
              onClick={handleReset}
              className="underline font-bold text-amber-200 hover:text-white ml-1 cursor-pointer"
            >
              Roast Your Own Page →
            </button>
          </div>
        )}
      </div>

      {/* Main Form or Result Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-4">
        {roastData ? (
          <RoastResult
            data={roastData}
            target={targetRoasted}
            isSharedView={isSharedView}
            onReset={handleReset}
          />
        ) : (
          <RoastForm
            onRoastSuccess={(data, target) => {
              setRoastData(data);
              setTargetRoasted(target);
              setIsSharedView(false);
            }}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-zinc-600 space-y-2">
        <p>
          Powered by Nvidia NIM & Meta Llama • Designed for high-converting landing pages.
        </p>
        <p>© {new Date().getFullYear()} Roastly. All rights reserved.</p>
      </footer>
    </main>
  );
}
