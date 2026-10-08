"use client";

import React, { useState, useEffect } from "react";
import { RoastData } from "@/lib/parseRoast";
import { buildTwitterShareUrl } from "@/lib/share";

interface RoastResultProps {
  data: RoastData;
  onReset: () => void;
}

export function RoastResult({ data, onReset }: RoastResultProps) {
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://roastly.hussnicer.workers.dev");
  const { killerQuote, roast, clarityScore, scoreReason, fixes } = data;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const getDamageBadge = (score: number) => {
    if (score < 30) {
      return {
        text: "FUNERAL SERVICE ARRANGED 😭🙏🥀",
        color: "text-red-400 bg-red-950/60 border-red-500/60",
        scoreColor: "text-red-500 border-red-500/60 bg-red-950/40",
        verdict: "Cooked Beyond Redemption",
      };
    }
    if (score < 50) {
      return {
        text: "BRO IS FIGHTING FOR HIS LIFE 😭🙏",
        color: "text-orange-400 bg-orange-950/60 border-orange-500/60",
        scoreColor: "text-orange-500 border-orange-500/60 bg-orange-950/40",
        verdict: "Secondhand Embarrassment",
      };
    }
    if (score < 75) {
      return {
        text: "UNC NEEDS TO CLOSE THE LAPTOP 💀",
        color: "text-amber-400 bg-amber-950/60 border-amber-500/60",
        scoreColor: "text-amber-500 border-amber-500/60 bg-amber-950/40",
        verdict: "Mid SaaS Clone",
      };
    }
    return {
      text: "RARE W (SURVIVED THE COMMENTS) 🔥",
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/60",
      scoreColor: "text-emerald-400 border-emerald-500/60 bg-emerald-950/40",
      verdict: "Valid & High Converting",
    };
  };

  const badge = getDamageBadge(clarityScore);
  const shareUrl = buildTwitterShareUrl(clarityScore, killerQuote, siteUrl);

  const handleCopy = async () => {
    const textToCopy = `Roastly Score: ${clarityScore}/100 (${badge.text})\n\n"${killerQuote}"\n\nFull Roast:\n${roast}\n\n10-Minute Fixes:\n1. ${fixes[0]}\n2. ${fixes[1]}\n3. ${fixes[2]}\n\nGet roasted at ${siteUrl} 😭🙏🥀`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Score & Verdict Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black tracking-wider uppercase shadow-sm">
              <span className={`px-2.5 py-1 rounded-full border ${badge.color}`}>
                {badge.text}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {badge.verdict}
            </h2>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              {scoreReason}
            </p>
          </div>

          <div
            className={`flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 ${badge.scoreColor} shrink-0 shadow-2xl backdrop-blur-md`}
          >
            <span className="text-4xl sm:text-5xl font-black leading-none tracking-tight">
              {clarityScore}
            </span>
            <span className="text-xs font-bold opacity-75 mt-0.5">/ 100</span>
          </div>
        </div>
      </div>

      {/* KILLER QUOTE (Top Reels Comment Card) */}
      <div className="relative rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-[#1c1214] via-surface to-[#161622] border-2 border-accent/50 shadow-2xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
            <span>🥀</span>
            <span>Top Comment (842k likes)</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700">
            📸 Screenshot Worthy
          </span>
        </div>
        <p className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
          "{killerQuote}"
        </p>
      </div>

      {/* The Full Autopsy Roast */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">😭</span>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            The Comment Section Breakdown
          </h3>
        </div>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
          {roast}
        </p>
      </div>

      {/* 3 Fixes Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-base font-bold text-white">
              3 Fixes So You Don't Get Cooked Again
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
            Revive Your Conversion Rate
          </span>
        </div>

        <ul className="space-y-3">
          {fixes.map((fix, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 bg-[#0d0d12] border border-border/90 rounded-xl p-3.5 text-zinc-200 text-sm leading-snug"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-zinc-800 text-accent font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1 font-medium">{fix}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3.5 px-5 rounded-xl font-black text-sm bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share Roast on X (Twitter)</span>
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-semibold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition-all"
        >
          <span>{copied ? "✓ Copied!" : "📋 Copy Roast"}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700 transition-all"
        >
          🔄 Roast Another
        </button>
      </div>
    </div>
  );
}
