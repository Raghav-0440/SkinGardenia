import Groq from "groq-sdk";
import { SKINGARDENIA_SYSTEM_PROMPT } from "./systemPrompt";

// Get API key from environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

// Initialize Groq client lazily to avoid issues at module load time
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured. Please set GROQ_API_KEY in your .env file.');
    }
    groq = new Groq({
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser environment
    });
  }
  return groq;
}

export async function askSkinGardenia(userMessage: string, chatHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []): Promise<string> {
  try {
    const client = getGroqClient();

    // Build messages array with system prompt, chat history, and current user message
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: "system",
        content: SKINGARDENIA_SYSTEM_PROMPT,
      },
      ...chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: msg.content
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Groq API Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get response: ${error.message}`);
    }
    throw new Error('Failed to get response. Please try again.');
  }
}

