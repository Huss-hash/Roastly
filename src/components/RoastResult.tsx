"use client";

import React, { useState, useEffect } from "react";
import { RoastData } from "@/lib/parseRoast";
import { buildTwitterShareUrl, encodeRoastToHash } from "@/lib/share";

interface RoastResultProps {
  data: RoastData;
  target?: string;
  isSharedView?: boolean;
  onReset: () => void;
}

export function RoastResult({ data, target, isSharedView, onReset }: RoastResultProps) {
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://roastly.hussnicer.workers.dev");
  const { killerQuote, roast, clarityScore, scoreReason, fixes, persona = "reels" } = data;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const getPersonaMeta = () => {
    if (persona === "gordon") {
      let badge = {
        text: "IT'S RAW! PITCH REJECTED 🔥",
        color: "text-red-400 bg-red-950/60 border-red-500/60",
        scoreColor: "text-red-500 border-red-500/60 bg-red-950/40",
        verdict: "Unmitigated Disaster",
      };
      if (clarityScore >= 30 && clarityScore < 50) {
        badge = {
          text: "BURNING SEED CAPITAL 📉",
          color: "text-orange-400 bg-orange-950/60 border-orange-500/60",
          scoreColor: "text-orange-500 border-orange-500/60 bg-orange-950/40",
          verdict: "Amateur Buzzword Salad",
        };
      } else if (clarityScore >= 50 && clarityScore < 75) {
        badge = {
          text: "PASSING ON THIS ROUND 🤷",
          color: "text-amber-400 bg-amber-950/60 border-amber-500/60",
          scoreColor: "text-amber-500 border-amber-500/60 bg-amber-950/40",
          verdict: "Bland & Forgettable",
        };
      } else if (clarityScore >= 75) {
        badge = {
          text: "ACTUAL PRODUCT-MARKET FIT 🦄",
          color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/60",
          scoreColor: "text-emerald-400 border-emerald-500/60 bg-emerald-950/40",
          verdict: "Rare Seed Check Worthy",
        };
      }
      return {
        badge,
        criticTitle: "🔥 Gordon Ramsay / Brutal VC Audit",
        quoteHeader: "The VC Partner Verdict",
        quoteSubtitle: "Tears Pitch Deck In Half",
        quoteGradient: "from-[#20100a] via-surface to-[#1f1410] border-amber-500/60",
        roastHeader: "The Executive Shredder Breakdown",
        roastIcon: "🔥",
        fixesHeader: "3 Directives Before You Pitch Another Human",
        fixesBadge: "Save Your Moat",
      };
    }

    if (persona === "cynic") {
      let badge = {
        text: "WALLET WELDED SHUT 💸",
        color: "text-red-400 bg-red-950/60 border-red-500/60",
        scoreColor: "text-red-500 border-red-500/60 bg-red-950/40",
        verdict: "Overpriced ChatGPT Wrapper",
      };
      if (clarityScore >= 30 && clarityScore < 50) {
        badge = {
          text: "FREE SPREADSHEET DOES THIS 📊",
          color: "text-orange-400 bg-orange-950/60 border-orange-500/60",
          scoreColor: "text-orange-500 border-orange-500/60 bg-orange-950/40",
          verdict: "Solution In Search Of A Problem",
        };
      } else if (clarityScore >= 50 && clarityScore < 75) {
        badge = {
          text: "NOT WORTH A 45-MIN DEMO 🗓️",
          color: "text-amber-400 bg-amber-950/60 border-amber-500/60",
          scoreColor: "text-amber-500 border-amber-500/60 bg-amber-950/40",
          verdict: "Typical Cloned Tool",
        };
      } else if (clarityScore >= 75) {
        badge = {
          text: "MIGHT SWIPE CREDIT CARD 💳",
          color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/60",
          scoreColor: "text-emerald-400 border-emerald-500/60 bg-emerald-950/40",
          verdict: "Legitimate ROI Detected",
        };
      }
      return {
        badge,
        criticTitle: "💸 The Cynical Buyer Audit",
        quoteHeader: "The Buyer's Verdict",
        quoteSubtitle: "Zero Dollars Spent",
        quoteGradient: "from-[#0a1814] via-surface to-[#0d161c] border-emerald-500/60",
        roastHeader: "The Buyer's Brutal Reality Check",
        roastIcon: "💸",
        fixesHeader: "3 Fixes To Convince Someone To Actually Pay You",
        fixesBadge: "Friction Reducer",
      };
    }

    // Default: Reels
    let badge = {
      text: "FUNERAL SERVICE ARRANGED 😭🙏🥀",
      color: "text-red-400 bg-red-950/60 border-red-500/60",
      scoreColor: "text-red-500 border-red-500/60 bg-red-950/40",
      verdict: "Cooked Beyond Redemption",
    };
    if (clarityScore >= 30 && clarityScore < 50) {
      badge = {
        text: "BRO IS FIGHTING FOR HIS LIFE 😭🙏",
        color: "text-orange-400 bg-orange-950/60 border-orange-500/60",
        scoreColor: "text-orange-500 border-orange-500/60 bg-orange-950/40",
        verdict: "Secondhand Embarrassment",
      };
    } else if (clarityScore >= 50 && clarityScore < 75) {
      badge = {
        text: "UNC NEEDS TO CLOSE THE LAPTOP 💀",
        color: "text-amber-400 bg-amber-950/60 border-amber-500/60",
        scoreColor: "text-amber-500 border-amber-500/60 bg-amber-950/40",
        verdict: "Mid SaaS Clone",
      };
    } else if (clarityScore >= 75) {
      badge = {
        text: "RARE W (SURVIVED THE COMMENTS) 🔥",
        color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/60",
        scoreColor: "text-emerald-400 border-emerald-500/60 bg-emerald-950/40",
        verdict: "Valid & High Converting",
      };
    }
    return {
      badge,
      criticTitle: "🥀 Instagram Reels Comment Section",
      quoteHeader: "Top Comment (842k likes)",
      quoteSubtitle: "📸 Screenshot Worthy",
      quoteGradient: "from-[#1c1214] via-surface to-[#161622] border-accent/60",
      roastHeader: "The Comment Section Breakdown",
      roastIcon: "😭",
      fixesHeader: "3 Fixes So You Don't Get Cooked Again",
      fixesBadge: "Revive Your Conversion Rate",
    };
  };

  const meta = getPersonaMeta();
  const badge = meta.badge;
  const shareTwitterUrl = buildTwitterShareUrl(data, siteUrl, target);

  const hash = encodeRoastToHash(data, target);
  const directRoastUrl = hash ? `${siteUrl}/?r=${hash}` : siteUrl;

  const handleCopy = async () => {
    const textToCopy = `Roastly Score: ${clarityScore}/100 (${badge.text})\nCritic: ${meta.criticTitle}\n\n"${killerQuote}"\n\nFull Roast:\n${roast}\n\nActionable Fixes:\n1. ${fixes[0]}\n2. ${fixes[1]}\n3. ${fixes[2]}\n\nSee full critique here: ${directRoastUrl}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Target roasted info bar */}
      {target && (
        <div className="flex items-center justify-between bg-[#12121a] border border-border px-4 py-2.5 rounded-xl text-xs text-zinc-300">
          <div className="flex items-center gap-2 truncate">
            <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              Website Roasted:
            </span>
            <span className="font-mono text-accent2 truncate max-w-[280px] sm:max-w-md">
              {target}
            </span>
          </div>
          {isSharedView ? (
            <span className="bg-accent/20 text-accent font-bold px-2 py-0.5 rounded border border-accent/40 text-[10px] shrink-0">
              Shared Roast
            </span>
          ) : null}
        </div>
      )}

      {/* Score & Verdict Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border text-xs font-black tracking-wider uppercase shadow-sm">
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

      {/* KILLER QUOTE CARD */}
      <div
        className={`relative rounded-2xl p-6 sm:p-7 bg-gradient-to-br ${meta.quoteGradient} border-2 shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider">
            <span>{meta.roastIcon}</span>
            <span>{meta.quoteHeader}</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700">
            {meta.quoteSubtitle}
          </span>
        </div>
        <p className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
          "{killerQuote}"
        </p>
      </div>

      {/* The Full Breakdown Roast */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.roastIcon}</span>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            {meta.roastHeader}
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
              {meta.fixesHeader}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
            {meta.fixesBadge}
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
          href={shareTwitterUrl}
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
          <span>{copied ? "✓ Link Copied!" : "📋 Copy Roast Link"}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-medium text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700 transition-all"
        >
          {isSharedView ? "🔥 Roast My Own Page" : "🔄 Roast Another"}
        </button>
      </div>
    </div>
  );
}
