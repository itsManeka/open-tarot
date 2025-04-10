import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const sendMessageToGPT = async (message: string) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        generationConfig: {
            maxOutputTokens: 512,
        },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    return response.text();
};
