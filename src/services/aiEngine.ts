import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const sendMessageToAI = async (message: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
        },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    return response.text();
};
