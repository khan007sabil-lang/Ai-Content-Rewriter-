
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function rewriteContent(originalText: string): Promise<string> {
  if (!originalText.trim()) {
    return "";
  }

  const prompt = `
    As an expert script editor specializing in YouTube automation and AI-generated content, your task is to elevate the provided text. 
    Rewrite it to be significantly more engaging, conversational, and compelling for a video audience. 
    Focus on improving clarity, flow, and storytelling. Eliminate robotic phrasing and inject a natural, human-like tone. 
    Ensure the final output is polished and ready for a voiceover. 
    Do not add any commentary or introductions like 'Here is the rewritten text:'. Just provide the rewritten script itself.

    Here is the text to rewrite:

    ---

    ${originalText}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
    });

    if (!response || !response.text) {
        throw new Error("Received an empty response from the AI.");
    }
    
    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to rewrite content. Please check your connection or API key.");
  }
}
