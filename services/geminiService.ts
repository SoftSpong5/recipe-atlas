import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Blog } from "../types";

// This file simulates calling a backend that would securely use the Gemini API.
// For this demo, we are calling the API directly from the client-side.
// In a real production app, the API key should NEVER be exposed on the client.

const getAi = () => {
    // In a real app, you would not need to do this on every call.
    // This is to ensure the latest key from the Vercel AI Playground is used.
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
}

export const createImagePromptFromRecipe = async (title: string, origin: string): Promise<string> => {
  const ai = getAi();
  const prompt = `Create a short, vivid, and artistic image prompt for DALL-E or Midjourney based on the following recipe title and origin. Focus on lighting, atmosphere, and a key visual element. Recipe: "${title}" from ${origin}.`;
  
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
  });
  
  return response.text?.replace(/"/g, '') || `A beautiful photo of ${title}`;
};

export const generateDailyRecipe = async (): Promise<Partial<Recipe>> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "Generate a single, unique, and delicious-sounding recipe. The recipe should be something a home cook can make. Include a title, origin (country/region), ingredients list, steps list, prep_time string, calories (number), and a list of relevant tags. Also include a few affiliate product suggestions related to the recipe.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          origin: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          prep_time: { type: Type.STRING },
          calories: { type: Type.INTEGER },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          affiliate_products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                link: { type: Type.STRING },
                price: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
      throw new Error("Failed to generate recipe from API.");
  }
  return JSON.parse(response.text);
};


export const generateDailyBlog = async (): Promise<Partial<Blog>> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Generate a short, engaging blog post (about 1-2 paragraphs) on a topic related to lifestyle, kitchen gear, wellness, or food. Return it in JSON format with keys: title, category ('Lifestyle', 'Gear', 'Wellness', or 'Food'), content, and author.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                content: { type: Type.STRING },
                author: { type: Type.STRING }
            }
          }
        }
    });

    if (!response.text) {
        throw new Error("Failed to generate blog from API.");
    }
    return JSON.parse(response.text);
};


export const moderateMessage = async (message: string): Promise<{ is_flagged: boolean }> => {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Is the following message inappropriate, spam, or harmful for a community chat? Respond with only "yes" or "no". Message: "${message}"`,
  });

  const is_flagged = response.text?.toLowerCase().includes('yes') || false;
  return { is_flagged };
};

export const askChefAI = async (recipeContext: string, userQuery: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful and friendly chef. Given the context of a recipe, answer the user's question. Be concise and encouraging. \n\nRecipe Context: ${recipeContext}\n\nUser Question: "${userQuery}"`,
        config: {
            temperature: 0.7,
            topP: 0.9,
        }
    });
    
    return response.text || "I'm not sure how to answer that right now, but that's a great question!";
};
