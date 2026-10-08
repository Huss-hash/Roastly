import { ChatMessage } from "../prompts";

export async function callLLM(messages: ChatMessage[]): Promise<string> {
  const rawKey = process.env.LLM_API_KEY;
  const apiKey = rawKey ? rawKey.trim() : "";
  if (!apiKey || apiKey === "nvapi-REPLACE_ME") {
    throw new Error("Missing or unconfigured LLM_API_KEY. Please provide your Nvidia API key in .env.");
  }

  const rawEndpoint = process.env.LLM_ENDPOINT || "https://integrate.api.nvidia.com/v1";
  const endpoint = rawEndpoint.trim().replace(/\/+$/, "");

  const rawModel = process.env.LLM_MODEL || "meta/llama-3.2-11b-vision-instruct";
  const model = rawModel.trim();

  const url = `${endpoint}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.9,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nvidia LLM API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Nvidia LLM response did not contain message content.");
  }

  return rawContent;
}
