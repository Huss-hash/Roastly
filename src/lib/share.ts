export function buildTwitterShareUrl(clarityScore: number, killerQuote: string, appUrl?: string): string {
  const rawUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || "https://roastly.app";
  const baseAppUrl = rawUrl.trim();

  let quoteSnippet = killerQuote.trim();
  if (quoteSnippet.length > 130) {
    quoteSnippet = quoteSnippet.slice(0, 127) + "...";
  }

  const tweet = `Roastly gave my landing page a ${clarityScore}/100 and said:\n\n"${quoteSnippet}" 💀\n\nGet roasted here: ${baseAppUrl}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
