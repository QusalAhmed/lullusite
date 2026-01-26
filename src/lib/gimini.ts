'use server';

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function getPostalCode(address: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `What is the postal code for this address: ${address}? Give me only numbers. If you don't know, respond with "".`,
    });
    return response.text;
}