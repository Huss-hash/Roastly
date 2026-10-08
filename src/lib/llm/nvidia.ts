import { ChatMessage } from "../prompts";

export async function callLLM(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey || apiKey === "nvapi-REPLACE_ME") {
    throw new Error("Missing or unconfigured LLM_API_KEY. Please provide your Nvidia API key in .env.");
  }

  const endpoint = process.env.LLM_ENDPOINT || "https://integrate.api.nvidia.com/v1";
  const model = process.env.LLM_MODEL || "meta/llama-3.2-11b-vision-instruct";

  const url = `${endpoint.replace(/\/+$/, "")}/chat/completions`;

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
