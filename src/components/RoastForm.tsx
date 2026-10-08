"use client";

import React, { useState, useEffect } from "react";
import { RoastData } from "@/lib/parseRoast";

interface RoastFormProps {
  onRoastSuccess: (data: RoastData) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const ROAST_LOADING_STEPS = [
  "Fetching landing page copy...",
  "Analyzing headline & hero clarity...",
  "Spotting vague buzzwords and clichés...",
  "Sharpening the roaster's wit...",
  "Formulating 3 high-impact 10-min fixes...",
];

export function RoastForm({ onRoastSuccess, isLoading, setIsLoading }: RoastFormProps) {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % ROAST_LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload =
      mode === "url"
        ? { url: url.trim() }
        : { text: text.trim() };

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
      {/* Mode Tabs */}
      <div className="flex bg-[#0d0d12] p-1.5 rounded-xl border border-border mb-6">
        <button
          type="button"
          onClick={() => { setMode("url"); setError(null); }}
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
          onClick={() => { setMode("text"); setError(null); }}
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
              <span>{ROAST_LOADING_STEPS[stepIndex]}</span>
            </div>
          ) : (
            <>
              <span>🔥</span>
              <span>Roast My Landing Page</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
