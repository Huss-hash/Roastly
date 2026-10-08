import { NextResponse } from "next/server";
import { fetchPage } from "@/lib/fetchPage";
import { extractContent } from "@/lib/extractContent";
import { buildPrompt } from "@/lib/prompts";
import { callLLM } from "@/lib/llm";
import { parseRoast, RoastData } from "@/lib/parseRoast";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { url, text } = body;

    const trimmedUrl = typeof url === "string" ? url.trim() : "";
    const trimmedText = typeof text === "string" ? text.trim() : "";

    if (!trimmedUrl && !trimmedText) {
      return NextResponse.json(
        { error: "invalid_input", message: "Please enter a landing page URL or paste your copy." },
        { status: 400 }
      );
    }

    let extractedContent = "";

    if (trimmedUrl) {
      try {
        const html = await fetchPage(trimmedUrl);
        const extracted = extractContent(html);
        extractedContent = extracted.formattedText || extracted.otherText || "";
        if (!extractedContent.trim()) {
          return NextResponse.json(
            {
              error: "fetch_failed",
              message: "Roastly couldn't extract readable text from that page. Try pasting the copy directly instead.",
            },
            { status: 422 }
          );
        }
      } catch (fetchErr: any) {
        return NextResponse.json(
          {
            error: "fetch_failed",
            message: "Roastly couldn't fetch that page. Try pasting the text instead.",
            detail: fetchErr.message,
          },
          { status: 422 }
        );
      }
    } else {
      extractedContent = trimmedText;
    }

    const messages = buildPrompt(extractedContent);

    let roastResult: RoastData | null = null;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const rawResponse = await callLLM(messages);
        roastResult = parseRoast(rawResponse);
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!roastResult) {
      const activeKey = process.env.LLM_API_KEY ? process.env.LLM_API_KEY.trim() : "";
      const keyHint = activeKey ? `${activeKey.slice(0, 10)}...${activeKey.slice(-4)}` : "NOT_SET";

      let friendlyMessage = "Roastly is overloaded or the critique failed.";
      if (lastError?.message.includes("403")) {
        friendlyMessage = `Nvidia API authorization failed (403) with key [${keyHint}]. Please verify LLM_API_KEY in Cloudflare.`;
      } else if (lastError?.message.includes("Missing or unconfigured LLM_API_KEY")) {
        friendlyMessage = "LLM_API_KEY is missing in Cloudflare environment variables.";
      }

      return NextResponse.json(
        {
          error: "llm_failed",
          message: friendlyMessage,
          keyHint,
          detail: lastError?.message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(roastResult);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "internal_error",
        message: "An unexpected error occurred. Please try again.",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
