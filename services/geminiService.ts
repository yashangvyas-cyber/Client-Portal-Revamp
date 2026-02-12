import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

export const generateProjectSummary = async (project: Project): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "API Key not found. Please set the API_KEY environment variable to use AI features.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const tasks = project.tasks || [];
    const progress = project.progress || 0;

    const prompt = `
      Act as a project manager. Summarize the status of the following project for a client update.
      Project Name: ${project.name}
      Progress: ${progress}%
      Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status })))}
      
      Keep it professional, encouraging, and under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please check console for details.";
  }
};