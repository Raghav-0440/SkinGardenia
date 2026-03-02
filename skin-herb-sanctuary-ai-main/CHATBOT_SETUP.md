# SkinGardenia Chatbot Setup

The chatbot has been integrated using the new SkinGardenia chatbot implementation with Groq API.

## Setup Instructions

1. **Get a Groq API Key**
   - Visit https://console.groq.com/
   - Sign up for a free account
   - Create an API key

2. **Configure Environment Variable**
   - Create a `.env` file in the root of `skin-herb-sanctuary-ai-main/` directory
   - Add your API key:
     ```
     VITE_GROQ_API_KEY=your_actual_api_key_here
     ```

3. **Restart the Development Server**
   - Stop the current frontend server (Ctrl+C)
   - Restart it with `npm run dev`

## Features

- Uses Groq API with `llama-3.3-70b-versatile` model
- Full SkinGardenia system prompt (herbal skincare assistant)
- Chat history support
- Season-aware recommendations
- Ingredient compatibility checking

## Model Details

- **Model**: `llama-3.3-70b-versatile`
- **Provider**: Groq (free tier available)
- **Temperature**: 0.7
- **Max Tokens**: 1000

## Troubleshooting

If you see "GROQ_API_KEY is not configured":
1. Make sure the `.env` file exists in the correct location
2. Make sure the variable is named `VITE_GROQ_API_KEY` (Vite requires the `VITE_` prefix)
3. Restart the development server after creating/updating the `.env` file

