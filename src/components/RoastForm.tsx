"use client";

import React, { useState, useEffect } from "react";
import { RoastData } from "@/lib/parseRoast";
import { RoastPersona } from "@/lib/prompts";

interface RoastFormProps {
  onRoastSuccess: (data: RoastData) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const PERSONA_CONFIG: Record<
  RoastPersona,
  {
    name: string;
    badge: string;
    icon: string;
    tagline: string;
    loadingSteps: string[];
    activeBorder: string;
    activeBg: string;
  }
> = {
  reels: {
    name: "Reels Funeral",
    badge: "😭🙏🥀 Viral",
    icon: "🥀",
    tagline: "Top IG Reels comment holding a funeral for your conversion rate",
    loadingSteps: [
      "Fetching landing page copy...",
      "Analyzing headline & secondhand embarrassment...",
      "Spotting the holy emoji trinity 😭🙏🥀...",
      "Summoning the top 800k liked comment...",
      "Formulating 3 high-impact copy rewrites...",
    ],
    activeBorder: "border-pink-500/70",
    activeBg: "bg-pink-950/20 text-pink-200",
  },
  gordon: {
    name: "Brutal VC / Ramsay",
    badge: "🔥 Zero Mercy",
    icon: "🔥",
    tagline: "Unforgiving investor & CRO auditor tearing buzzword salad to shreds",
    loadingSteps: [
      "Auditing landing page copy...",
      "Scanning for delusional corporate buzzwords...",
      "Calculating your time-to-bankruptcy...",
      "Tasting the copy: IT'S RAW!...",
      "Formulating 3 undeniable executive rewrites...",
    ],
    activeBorder: "border-amber-500/70",
    activeBg: "bg-amber-950/20 text-amber-200",
  },
  cynic: {
    name: "Cynical Buyer",
    badge: "💸 Wallet Closed",
    icon: "💸",
    tagline: "Skeptical buyer who refuses to pay for another ChatGPT wrapper",
    loadingSteps: [
      "Inspecting landing page copy...",
      "Detecting ChatGPT wrapper signals...",
      "Searching for hidden pricing traps...",
      "Drafting a free Google Sheet alternative...",
      "Formulating 3 no-BS customer rewrites...",
    ],
    activeBorder: "border-emerald-500/70",
    activeBg: "bg-emerald-950/20 text-emerald-200",
  },
};

export function RoastForm({ onRoastSuccess, isLoading, setIsLoading }: RoastFormProps) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [persona, setPersona] = useState<RoastPersona>("reels");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const currentSteps = PERSONA_CONFIG[persona].loadingSteps;

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % currentSteps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading, currentSteps.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload =
      mode === "url"
        ? { url: url.trim(), persona }
        : { text: text.trim(), persona };

    if (mode === "url" && !payload.url) {
      setError("Please enter a valid website URL.");
      return;
    }
    if (mode === "text" && !payload.text) {
      setError("Please paste your landing page copy.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to generate roast.");
      }

      onRoastSuccess(data as RoastData);
    } catch (err: any) {
      setError(err.message || "Something went wrong while roasting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      {/* Persona Selection Header */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
          Select Your Roast Critic Persona:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(["reels", "gordon", "cynic"] as RoastPersona[]).map((p) => {
            const cfg = PERSONA_CONFIG[p];
            const isSelected = persona === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPersona(p)}
                disabled={isLoading}
                className={`text-left p-3 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `${cfg.activeBorder} ${cfg.activeBg} shadow-lg ring-1 ring-white/10`
                    : "bg-[#0d0d12] border-border text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{cfg.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      isSelected
                        ? "bg-black/40 border-current"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {cfg.badge}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{cfg.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-snug">
                    {cfg.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-[#0d0d12] p-1.5 rounded-xl border border-border mb-6">
        <button
          type="button"
          onClick={() => {
            setMode("url");
            setError(null);
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === "url"
              ? "bg-[#20202a] text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          disabled={isLoading}
        >
          🌐 Enter Website URL
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("text");
            setError(null);
          }}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === "text"
              ? "bg-[#20202a] text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          disabled={isLoading}
        >
          📝 Paste Copy Directly
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "url" ? (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-zinc-300 mb-2">
              Landing Page URL
            </label>
            <div className="relative">
              <input
                id="url-input"
                type="text"
                placeholder="e.g. https://mycoolstartup.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#0d0d12] border border-border rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-base transition-all"
              />
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              We'll scrape your headline, hero copy, and CTA button automatically.
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-zinc-300 mb-2">
              Landing Page Copy
            </label>
            <textarea
              id="text-input"
              rows={5}
              placeholder="Paste your H1 headline, subhead, body text, and main CTA button..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              className="w-full bg-[#0d0d12] border border-border rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all resize-y"
            />
            <p className="text-xs text-zinc-400 mt-2">
              Ideal for private drafts, local mockups, or sites behind bot-protections.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-700/50 rounded-xl p-4 text-sm text-red-300 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">Roast Failed</p>
              <p className="mt-0.5 text-red-200/90">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            isLoading
              ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
              : "bg-gradient-to-r from-accent to-accent2 hover:opacity-95 active:scale-[0.99] text-black font-extrabold cursor-pointer"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
              <span>{currentSteps[stepIndex]}</span>
            </div>
          ) : (
            <>
              <span>{PERSONA_CONFIG[persona].icon}</span>
              <span>Roast With {PERSONA_CONFIG[persona].name}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
