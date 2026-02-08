import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getArtisticAdvice = async (topic: string, childAge: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a friendly, encouraging art teacher at KashArtsStudio. 
        A parent asks about the topic: "${topic}" for their ${childAge}-year-old child.
        
        Provide a short, helpful response (max 80 words) covering:
        1. Why this skill is important.
        2. A simple fun activity they can do at home to practice.
        
        Keep the tone warm and professional.
      `,
    });
    return response.text || "Unable to generate advice at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI art assistant is currently taking a creative break. Please try again later.";
  }
};
