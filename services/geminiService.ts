
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getProductivityAdvice(tasks: Task[]) {
  const taskSummary = tasks.map(t => `- ${t.title} (Category ID: ${t.categoryId}, ${t.completed ? 'Done' : 'Pending'})`).join('\n');

  const prompt = `
    Below is a list of my current productivity tasks:
    ${taskSummary || 'No tasks added yet.'}

    Based on this, please provide:
    1. A short analysis of my productivity patterns.
    2. Three personalized actionable tips to improve my focus.
    3. A motivational quote related to productivity.
    
    Keep the tone professional, encouraging, and modern.
  `;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-2.5-flash-lite for fast, low-latency productivity audits
      model: 'gemini-2.5-flash-lite-latest',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble analyzing your schedule right now. Try adding more tasks or check your connection.";
  }
}

export function createChatSession() {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Tracify AI, a sophisticated personal assistant and productivity coach. You help users manage their time, habits, and tasks. You are knowledgeable about time management techniques like Pomodoro, Eisenhower Matrix, and Atomic Habits. Keep your responses concise, visually structured with markdown if needed, and professional yet friendly.",
    }
  });
}
