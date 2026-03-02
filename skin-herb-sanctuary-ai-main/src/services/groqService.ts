import axios from 'axios';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type GroqResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const GROQ_API_KEY = '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'; // Updated API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const ALLOWED_PLANTS = [
  "Sacred Fig", "Mexican Poppy", "Indian Madder", "Mango Ginger", 
  "Black Nightshade", "Comfrey", "Indigo", "Oregon Grape", 
  "Hemp Seed Oil", "Nettles", "Holy Basil", "Echinacea", 
  "Gotu Kola", "Calendula", "Aloe Vera", "Turmeric", 
  "Neem", "Sandalwood", "Saffron"
];

const ALLOWED_REMEDIES = [
  "Rose Water and Aloe Vera Mask", "Cucumber and Mint Face Mask", 
  "Neem and Turmeric Face Pack", "Green Tea and Honey Mask", 
  "Turmeric and Milk Face Pack", "Honey Aloe Face Mask", 
  "Rice Water Toner", "Papaya and Honey Face Pack", 
  "Aloe Vera Gel with Rose Water", "Coconut Lemon Body Scrub", 
  "Oatmeal and Honey Face Mask", "Cucumber Face Mask", 
  "Besan Body Scrub", "Saffron and Honey Face Pack", 
  "Turmeric and Gram Flour Face Pack"
];

const systemPrompt = `You are an expert herbal skincare assistant. Follow these rules STRICTLY:

1. PLANT/REMEDY USAGE:
   - ONLY use from these approved lists:
     Plants: ${ALLOWED_PLANTS.join(', ')}
     Remedies: ${ALLOWED_REMEDIES.join(', ')}
   - NEVER suggest anything outside these lists

2. RESPONSE BEHAVIOR:
   - Maintain full conversation context
   - If something didn't work, suggest alternatives
   - Address all concerns in complex queries
   - Never repeat ineffective suggestions

3. RESPONSE FORMAT:
   [Skin Concern]
   • [Detailed description of concern]
   
   [Recommended Plants]
   • [Plant 1] - [Specific benefit for this case]
   • [Plant 2] - [Specific benefit for this case]
   
   [Suggested Remedies]
   • [Remedy 1] - [Specific instructions for this case]
   • [Remedy 2] - [Specific instructions for this case]`;

export async function generateResponse(query: string, chatHistory: Message[] = []): Promise<string> {
  try {
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: query }
    ];

    const response = await axios.post<GroqResponse>(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.5
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        timeout: 30000
      }
    );

    return response.data.choices[0]?.message?.content || "Please describe your concern in more detail.";

  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Connection issue - please try again');
  }
}