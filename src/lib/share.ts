import { RoastData } from "./parseRoast";

export function encodeRoastToHash(data: RoastData, target?: string): string {
  try {
    const arrayForm = [
      data.clarityScore,
      data.killerQuote,
      data.roast,
      data.scoreReason,
      data.fixes,
      data.persona || "reels",
      target || "",
    ];
    const json = JSON.stringify(arrayForm);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (err) {
    return "";
  }
}

export function decodeRoastFromHash(hash: string): { data: RoastData; target?: string } | null {
  try {
    if (!hash || typeof hash !== "string") return null;
    let base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const arr = JSON.parse(json);
    if (!Array.isArray(arr) || arr.length < 5) return null;

    return {
      data: {
        clarityScore: Number(arr[0]) || 0,
        killerQuote: String(arr[1] || ""),
        roast: String(arr[2] || ""),
        scoreReason: String(arr[3] || ""),
        fixes: [
          String(arr[4]?.[0] || ""),
          String(arr[4]?.[1] || ""),
          String(arr[4]?.[2] || ""),
        ],
        persona: arr[5] || "reels",
      },
      target: arr[6] ? String(arr[6]) : undefined,
    };
  } catch (err) {
    return null;
  }
}

export function buildTwitterShareUrl(
  data: RoastData,
  appUrl?: string,
  target?: string
): string {
  const rawUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || "https://roastly.hussnicer.workers.dev";
  const baseAppUrl = rawUrl.trim().replace(/\/+$/, "");

  const hash = encodeRoastToHash(data, target);
  const shareableRoastLink = hash ? `${baseAppUrl}/?r=${hash}` : baseAppUrl;

  let quoteSnippet = data.killerQuote.trim();
  if (quoteSnippet.length > 110) {
    quoteSnippet = quoteSnippet.slice(0, 107) + "...";
  }

  const tweet = `Roastly gave my landing page a ${data.clarityScore}/100 and said:\n\n"${quoteSnippet}" 💀\n\nSee full roast & fixes here: ${shareableRoastLink}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
