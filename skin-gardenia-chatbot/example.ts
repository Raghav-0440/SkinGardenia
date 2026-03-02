/**
 * Example usage of SkinGardenia chatbot
 * 
 * Run with: npx ts-node example.ts
 * (Make sure .env file has GROQ_API_KEY set)
 */

import dotenv from 'dotenv';
import { askSkinGardenia } from './chat';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🌿 SkinGardenia Chatbot Example\n');

  try {
    // Example 1: Simple question
    console.log('Question 1: Can I mix turmeric and lemon?');
    const response1 = await askSkinGardenia("Can I mix turmeric and lemon?");
    console.log('Response:', response1);
    console.log('\n---\n');

    // Example 2: With chat history
    console.log('Question 2: What about for sensitive skin?');
    const chatHistory = [
      { role: 'user' as const, content: 'I have acne' },
      { role: 'assistant' as const, content: 'Acne can be managed with natural remedies like neem and turmeric. These help reduce inflammation and bacteria.' }
    ];
    const response2 = await askSkinGardenia("What about for sensitive skin?", chatHistory);
    console.log('Response:', response2);
    console.log('\n---\n');

    // Example 3: Skin condition question
    console.log('Question 3: How to treat dry skin in winter?');
    const response3 = await askSkinGardenia("How to treat dry skin in winter?");
    console.log('Response:', response3);

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
  }
}

main();

