import { NextResponse } from 'next/server';
const pdf = require('pdf-parse');

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const data = await pdf(buffer);
        
        return NextResponse.json({ text: data.text });
    } catch (error) {
        console.error("Error extracting PDF:", error);
        return NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 });
    }
}
