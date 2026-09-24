# Roastly

> Drop your URL. Get roasted. Fix it in 10 minutes.

Roastly is a one-page app: paste a landing page URL or its copy, and get a
funny-but-honest roast, a 0–100 Clarity Score, and 3 fixes you can ship in
about 10 minutes. This is the canonical repository for the Roastly MVP.

## Clone the repo

```bash
git clone https://github.com/<your-username>/roastly.git
cd roastly
```

## Install dependencies

```bash
npm install
```

## Set environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `LLM_PROVIDER` | Currently only `nvidia`. |
| `LLM_ENDPOINT` | Nvidia's OpenAI-compatible base URL, e.g. `https://integrate.api.nvidia.com/v1`. |
| `LLM_API_KEY` | Free API key from [build.nvidia.com](https://build.nvidia.com). |
| `LLM_MODEL` | Default: `meta/llama-3.3-70b-instruct`. |
| `NEXT_PUBLIC_APP_URL` | Public URL used in the "Share on X" tweet link. |

## Run locally

```bash
npm run dev
```

Open http://localhost:3000. You should see the Roastly hero and a
"Scaffolding OK" note (the roast form is added in Step 3).

## Deploy

### Vercel (recommended)

1. Push this repo to GitHub (already done if you cloned it).
2. Go to https://vercel.com/new and import the `roastly` repo.
3. Add the environment variables from `.env.example` in the Vercel project
   settings (Settings → Environment Variables).
4. Deploy. Vercel auto-detects Next.js — no build config needed.

### Cloudflare Pages

1. Go to your Cloudflare dashboard → Workers & Pages → Create → Pages →
   Connect to Git, and pick the `roastly` repo.
2. Build command: `npm run build`. Build output directory: `.next`.
3. Add the same environment variables as above.
4. Note: the `/api/roast` route uses Node APIs (via `cheerio`) for HTML
   parsing. If Cloudflare's build fails on this, switch the route's runtime
   or swap `cheerio` for a lighter regex-based extractor — flagged in
   `architecture.md`.

## Continuing in Antigravity IDE

Open this cloned folder directly in Antigravity — it's a standard Next.js
App Router project, so no extra setup is needed beyond `npm install`.

## Project structure

See `architecture.md` for the full data flow and where the LLM prompt lives.
