import * as cheerio from "cheerio";

export interface ExtractedLandingPage {
  headline?: string;
  subhead?: string;
  heroText?: string;
  callToAction?: string;
  socialProof?: string;
  otherText?: string;
  formattedText: string;
}

export function extractContent(html: string): ExtractedLandingPage {
  const $ = cheerio.load(html);

  // Remove script, style, svg, noscript, nav, footer to avoid noise
  $("script, style, noscript, svg, nav, footer, iframe").remove();

  const headline = $("h1").first().text().trim() || $("h2").first().text().trim();

  // Likely subhead: next sibling or first h2/p following h1
  let subhead = "";
  if ($("h1").length > 0) {
    const nextElem = $("h1").first().next("p, h2, h3");
    if (nextElem.length > 0) {
      subhead = nextElem.text().trim();
    }
  }
  if (!subhead) {
    subhead = $("h2").first().text().trim();
  }

  // Hero paragraph / description
  const heroParagraph = $("header p, [class*='hero'] p, main p, section p")
    .first()
    .text()
    .trim();

  // CTA button or link
  const callToAction = $(
    "button, a[class*='btn'], a[class*='button'], a[class*='cta'], [role='button']"
  )
    .first()
    .text()
    .trim();

  // Social proof or testimonials
  const socialProof = $(
    "[class*='testimonial'], [class*='review'], [class*='proof'], [class*='rating'], [class*='quote']"
  )
    .slice(0, 3)
    .text()
    .replace(/\s+/g, " ")
    .trim();

  // Visible body text fallback / supplemental
  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  // Build clean representation
  const parts: string[] = [];
  if (headline) parts.push(`Headline (H1): ${headline}`);
  if (subhead && subhead !== headline) parts.push(`Subhead: ${subhead}`);
  if (heroParagraph && heroParagraph !== subhead) parts.push(`Hero Description: ${heroParagraph}`);
  if (callToAction) parts.push(`Primary CTA: ${callToAction}`);
  if (socialProof) parts.push(`Social Proof / Testimonials: ${socialProof}`);
  if (parts.length === 0 || bodyText.length < 200) {
    parts.push(`Visible Content: ${bodyText}`);
  }

  return {
    headline: headline || undefined,
    subhead: subhead || undefined,
    heroText: heroParagraph || undefined,
    callToAction: callToAction || undefined,
    socialProof: socialProof || undefined,
    otherText: bodyText,
    formattedText: parts.join("\n\n"),
  };
}
