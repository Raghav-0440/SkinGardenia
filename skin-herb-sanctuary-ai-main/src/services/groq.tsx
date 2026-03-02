// services/groq.tsx
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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", // Updated API key
  dangerouslyAllowBrowser: true, // Required for browser environment
});

const SYSTEM_PROMPT = `
You are an expert herbal skincare assistant. 
Only use information from the provided list of medicinal plants and home remedies.
Always respond in a friendly, professional manner focused on herbal solutions.
`;

interface ChatHistory {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

export async function chatWithGroq(userInput: string, chatHistory: ChatHistory): Promise<string> {
  try {
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...chatHistory.messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
      { role: "user" as const, content: userInput },
    ];

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768", // Groq's fast Mixtral model
      messages,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error communicating with Groq:", error);
    return "I'm having trouble connecting. Please try again later.";
  }
}
