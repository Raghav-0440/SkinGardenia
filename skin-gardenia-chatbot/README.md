# SkinGardenia Chatbot

A standalone chatbot implementation using Groq API with the SkinGardenia system prompt.

## Features

- Uses Groq API with `llama-3.3-70b-versatile` model (free tier)
- Full SkinGardenia system prompt (herbal skincare assistant)
- Chat history support
- TypeScript implementation
- Error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your API key in `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

### Basic Example

```typescript
import { askSkinGardenia } from './chat';

// Simple query
const response = await askSkinGardenia("Can I mix turmeric and lemon?");
console.log(response);

// With chat history
const chatHistory = [
  { role: 'user', content: 'I have acne' },
  { role: 'assistant', content: 'Acne can be managed with natural remedies...' }
];

const response2 = await askSkinGardenia("What about sensitive skin?", chatHistory);
console.log(response2);
```

### Node.js Example

```typescript
import dotenv from 'dotenv';
import { askSkinGardenia } from './chat';

dotenv.config();

async function main() {
  try {
    const response = await askSkinGardenia(
      "Can I mix turmeric and lemon?"
    );
    console.log(response);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Browser Example (with Vite)

```typescript
import { askSkinGardenia } from './chat';

// In your React component or vanilla JS
const handleChat = async (userMessage: string) => {
  try {
    const response = await askSkinGardenia(userMessage, chatHistory);
    return response;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};
```

## Files

- `chat.ts` - Main chat function with Groq integration
- `systemPrompt.ts` - Complete SkinGardenia system prompt (the "brain")
- `.env` - API key configuration (keep this secure!)
- `package.json` - Dependencies and project config

## API Key

Get your free Groq API key from: https://console.groq.com/

## Model

- **Model**: `llama-3.3-70b-versatile`
- **Provider**: Groq (free tier available)
- **Temperature**: 0.7
- **Max Tokens**: 1000

## Notes

- The system prompt is in `systemPrompt.ts` - this is the "brain" of the chatbot
- Chat history is maintained automatically when you pass it to the function
- The API key should be kept secure and not committed to version control

