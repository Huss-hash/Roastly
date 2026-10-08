import { ChatMessage } from "../prompts";
import { callLLM as callNvidia } from "./nvidia";

export async function callLLM(messages: ChatMessage[]): Promise<string> {
  const provider = (process.env.LLM_PROVIDER || "nvidia").toLowerCase();

  switch (provider) {
    case "nvidia":
      return callNvidia(messages);
    default:
      throw new Error(`Unsupported LLM provider: "${provider}". Only "nvidia" is currently configured.`);
  }
}
