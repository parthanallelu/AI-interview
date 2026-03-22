import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { question, userAns } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Question: ${question}
            User Answer: ${userAns}
            
            Evaluate the user's answer for technical accuracy, completeness, and clarity.
            Provide a rating from 1 to 10 and constructive feedback in 3-5 lines.
            
            Return the response strictly in JSON format:
            {
                "rating": "number",
                "feedback": "string"
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean the response if it contains markdown code blocks
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const feedbackData = JSON.parse(cleanJson);

        return NextResponse.json(feedbackData);

    } catch (error) {
        console.error("Error in feedback API:", error);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
