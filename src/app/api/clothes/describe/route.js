import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

// -- Google Gemini API Setup ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const client = new GoogleGenAI({
    apiKey: GEMINI_API_KEY
});


export async function POST(request) {
  try {
    // Get image and query from the client request
    const { image, language } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }
    const usedLanguage = language || 'en'; // Default to English if not provided
    console.log('Using language:', usedLanguage);
    // Send the image and query to the Gemini API
    const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-lite-preview-06-17',
        contents: [
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: image.split(',')[1] // Extract Base64 data from the image string
                }
            },
            {
                text: "What is this clothing item? Answer in " + usedLanguage + " (he - hebrew, en - english)"
            }
        ],
        config: {
            systemInstruction: `You are a fashion assistant. 
            You MUST use the language: ${usedLanguage} (he - hebrew, en - english)
            Analyze the provided image and return a short few word description of the clothing item.
            Do not use dots or commas in your response, just a few words.
            In addition, provide type of clothing item in the response as well.`,
            responseMimeType: 'application/json', // Ensure the response is in JSON format
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: {
                        type: Type.STRING,
                    },
                    type: {
                        type: Type.STRING,
                        enum: ['tshirt', 'fragrance', 'pants', 'shorts', 'dress', 'skirt', 'jacket', 'shoes', 'accessory'], // Define expected types
                    }
                },
            }
        }
    })

    return NextResponse.json(response.text, { status: 200 });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
