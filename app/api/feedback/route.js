import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const { question, userAns } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Question: ${question}
            User Answer: ${userAns}
            
            As a Senior Technical Interviewer, evaluate the user's answer based on:
            1. Technical Correctness: Is the answer factually accurate?
            2. Communication Clarity: Is the tone professional and the explanation clear?
            3. Completeness: Did the user cover all aspects of the question?
            4. Confidence: Does the answer sound authoritative and well-reasoned?
            5. Keyword Relevance: Did they use appropriate industry terminology?

            Return the evaluation strictly in the following JSON structure:
            {
                "score": (number 1-10),
                "confidence_rating": (string: "High", "Moderate", or "Low"),
                "performance_summary": (string 1-2 sentences),
                "strengths": [(array of 2-3 specific points)],
                "weaknesses": [(array of 2-3 specific points)],
                "improvements": [(array of 2-3 actionable tips)],
                "model_answer": (string: a concise, high-quality reference answer)
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const feedbackData = JSON.parse(cleanJson);

        return NextResponse.json(feedbackData);

    } catch (error) {
        console.error("Error in feedback API:", error);
        return NextResponse.json({ error: "Failed to generate professional assessment" }, { status: 500 });
    }
}
