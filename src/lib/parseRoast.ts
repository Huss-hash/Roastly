export interface RoastData {
  killerQuote: string;
  roast: string;
  clarityScore: number;
  scoreReason: string;
  fixes: [string, string, string];
}

export function parseRoast(raw: string): RoastData {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from LLM response: ${err.message}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Parsed LLM output is not an object.");
  }

  const roast =
    typeof parsed.roast === "string" && parsed.roast.trim()
      ? parsed.roast.trim()
      : typeof parsed.critique === "string"
      ? parsed.critique.trim()
      : "Your landing page is so generic it hurts.";

  const killerQuote =
    typeof parsed.killerQuote === "string" && parsed.killerQuote.trim()
      ? parsed.killerQuote.trim()
      : roast.split(".")[0] + ".";

  let clarityScore = Number(parsed.clarityScore ?? parsed.score ?? parsed.clarity);
  if (isNaN(clarityScore)) {
    clarityScore = 30;
  }
  clarityScore = Math.max(0, Math.min(100, Math.round(clarityScore)));

  const scoreReason =
    typeof parsed.scoreReason === "string" && parsed.scoreReason.trim()
      ? parsed.scoreReason.trim()
      : typeof parsed.reason === "string" && parsed.reason.trim()
      ? parsed.reason.trim()
      : "Vague value proposition and excessive buzzwords.";

  let rawFixes = parsed.fixes ?? parsed.improvements ?? parsed.recommendations ?? parsed.actionable_fixes;
  let fixes: string[] = [];

  if (Array.isArray(rawFixes)) {
    fixes = rawFixes
      .map((f: any) => (typeof f === "string" ? f.trim() : typeof f === "object" ? JSON.stringify(f) : String(f).trim()))
      .filter(Boolean);
  } else if (rawFixes && typeof rawFixes === "object") {
    fixes = Object.values(rawFixes)
      .map((f: any) => (typeof f === "string" ? f.trim() : String(f).trim()))
      .filter(Boolean);
  }

  if (fixes.length < 1) {
    fixes.push("Replace vague buzzwords with concrete examples of what your product actually does.");
  }
  if (fixes.length < 2) {
    fixes.push("Rewrite your H1 headline to pass the 5-second test: what is it, who is it for, and why care?");
  }
  if (fixes.length < 3) {
    fixes.push("Turn your generic CTA button into a clear, low-friction action verb.");
  }

  const finalFixes: [string, string, string] = [fixes[0], fixes[1], fixes[2]];

  return {
    killerQuote,
    roast,
    clarityScore,
    scoreReason,
    fixes: finalFixes,
  };
}
