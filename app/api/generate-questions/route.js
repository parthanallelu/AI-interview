import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean JSON formatting from Gemini's response
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const questionsData = JSON.parse(cleanJson);

        return NextResponse.json(questionsData);

    } catch (error) {
        console.error("Error generating questions:", error);
        return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 });
    }
}
