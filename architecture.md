# Roastly — Architecture

## Overview

Roastly is a stateless Next.js (App Router) app with one API route. No
database, no auth, no persistence in v1.

## Data flow

```
RoastForm (client)
  → POST /api/roast { url?, text? }
    → fetchPage(url)            [only if url given]
    → extractContent(html)      [headline, subhead, hero, CTA, social proof]
    → buildPrompt(content)
    → callLLM(prompt)           [src/lib/llm/index.ts → provider]
    → parseRoast(raw)           [validate/repair JSON shape]
  ← { roast, clarityScore, scoreReason, fixes[3] }
RoastResult (client)
  → ShareOnXButton (builds a twitter.com/intent/tweet URL)
```

## Key modules

- `src/app/page.tsx` — the single page: renders `RoastForm`, then
  `RoastResult` once a response comes back.
- `src/app/api/roast/route.ts` — the only server logic. Validates input,
  orchestrates fetch → extract → prompt → LLM → parse, and returns JSON.
- `src/lib/fetchPage.ts` — server-side `fetch` with:
  - an 8s timeout (`AbortController`),
  - a capped response size,
  - a basic guard against private/internal IPs and `localhost` targets
    (SSRF hygiene, since we're fetching user-supplied URLs),
  - a normal browser `User-Agent` (some sites block empty/bot UAs).
- `src/lib/extractContent.ts` — uses `cheerio` to pull `<h1>`, likely
  subhead, hero paragraph, primary CTA button/link text, and testimonial-
  like blocks. Falls back to stripped visible body text if nothing
  structured is found.
- `src/lib/prompts.ts` — builds the system + user messages sent to the LLM
  (see below).
- `src/lib/llm/index.ts` — `callLLM(messages)`: reads `LLM_PROVIDER` and
  delegates to the matching provider module. This is the ONLY place that
  knows how to route to a provider.
- `src/lib/llm/nvidia.ts` — calls Nvidia's OpenAI-compatible
  `{LLM_ENDPOINT}/chat/completions` with `LLM_API_KEY` / `LLM_MODEL`.
  **To swap providers**: add `src/lib/llm/<provider>.ts` with the same
  `callLLM(messages): Promise<string>` signature, then add a branch in
  `src/lib/llm/index.ts`.
- `src/lib/parseRoast.ts` — parses the LLM's JSON response defensively:
  strips stray markdown fences, validates required fields/types, retries
  once on failure.
- `src/lib/share.ts` — builds the `https://twitter.com/intent/tweet?...`
  URL from the score and `NEXT_PUBLIC_APP_URL`, picking one of a few tweet
  templates.

## LLM prompt

**System:**
> You are a witty but helpful landing page critic. You roast landing pages
> in a funny, constructive way. Be specific, actionable and a bit savage,
> but never cruel. Only critique what's in the provided content; don't
> invent things you can't see. Respond with valid JSON only, no markdown
> fences.

**User:**
> Here is the content extracted from a landing page (headline, subhead,
> hero text, CTA, social proof, other visible text):
> `<content>...</content>`
>
> Return JSON in exactly this shape:
> `{ "roast": string, "clarityScore": integer 0-100, "scoreReason": string, "fixes": [string, string, string] }`
>
> Each fix must be specific, high-impact, and doable in about 10 minutes.

## Error handling

- URL unreachable / timeout / non-200 → `{ error: "fetch_failed" }` →
  UI shows "Roastly couldn't fetch that page. Try pasting the text
  instead."
- LLM call fails or returns unparseable JSON after one retry →
  `{ error: "llm_failed" }` → UI shows a generic "Roastly is overloaded,
  try again in a bit."
- No `url` and no `text` in the request body → 400 with a validation
  message.

## Future extensions (not in v1)

- Additional "roast modes" (X bio, product one-liner) — would add a
  `mode` field to the request and a matching prompt builder in
  `prompts.ts`; the rest of the pipeline is mode-agnostic.
- Leaderboard/history — would need a database (e.g. Vercel Postgres or
  Cloudflare D1) and a new `/api/roasts` route; out of scope for the
  stateless MVP.
