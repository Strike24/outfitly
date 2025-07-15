import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request) {
  try {
    // Get the list of item descriptions and the setting prompt from the client
    const { items, setting } = await request.json();
    if (!Array.isArray(items) || !setting) {
      return NextResponse.json({ error: 'Missing items or setting' }, { status: 400 });
    }

    // Compose the prompt for Gemini
    const prompt = `You are a fashion assistant. Given the following clothing items: ${items
      .map((item, i) => `${i}. ${item.description} (${item.type})`)
      .join(', ')} and the setting: "${setting}", select the best matching outfit. 
Return a JSON object with the following structure: { "selected": [indices of selected items], "reason": "short explanation" }`;

    // Call Gemini
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: prompt },
      ],
      config: {
        systemInstruction: `You are a fashion assistant. Analyze the provided clothing items and setting, and select the best matching outfit.
        Return a JSON object with the selected item indices and a short explanation.
        Index starts from 0.`,
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                selected: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER },
                },
                reason: { type: Type.STRING },
            },
            required: ['selected', 'reason'],
        },
    }
    });
    console.log('Gemini response:', response.text);
    return NextResponse.json(response.text, { status: 200 });
  } catch (error) {
    console.error('Error creating outfit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
