import Groq from "groq-sdk";
import { SKINGARDENIA_SYSTEM_PROMPT } from "./skinGardeniaPrompt";

// Get API key from environment variable or use hardcoded fallback
// In Vite, environment variables must be prefixed with VITE_ to be exposed to the client
const getApiKey = (): string => {
  const envKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
  if (envKey && envKey.trim() && envKey !== 'your_groq_api_key_here') {
    return envKey;
  }
  // Fallback to hardcoded API key
  return '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';
};

const GROQ_API_KEY = getApiKey();

// Initialize Groq client lazily to avoid issues at module load time
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '') {
      throw new Error('GROQ_API_KEY is not configured. Please set VITE_GROQ_API_KEY in your .env file.');
    }
    console.log('Initializing Groq client with API key:', GROQ_API_KEY.substring(0, 10) + '...');
    groq = new Groq({
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true, // Required for browser environment
    });
  }
  return groq;
}

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function askSkinGardenia(
  userMessage: string, 
  chatHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
): Promise<string> {
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
  } catch (error: any) {
    console.error('Groq API Error:', error);
    
    // Better error handling for API errors
    if (error?.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Groq API key configuration.');
    }
    
    if (error?.message) {
      // Check if it's a structured error from Groq
      if (error.message.includes('Invalid API Key') || error.message.includes('invalid_api_key')) {
        throw new Error('Invalid API key. Please verify your Groq API key is correct.');
      }
      throw new Error(`Failed to get response: ${error.message}`);
    }
    
    throw new Error('Failed to get response. Please try again.');
  }
}

// Alias for compatibility with existing code
export async function generateResponse(query: string, chatHistory: Message[] = []): Promise<string> {
  return askSkinGardenia(query, chatHistory);
}

