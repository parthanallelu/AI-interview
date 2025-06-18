import { GoogleGenAI } from '@google/genai';

// Make sure to add your API key to environment variables
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function generateInterviewQuestions(jobPosition, jobDescription, yearOfExperience) {
    try {
        const ai = new GoogleGenAI({
            apiKey: GEMINI_API_KEY,
        });

        const config = {
            responseMimeType: 'application/json', // Changed to JSON since we want JSON response
        };

        const model = 'gemini-1.5-flash';

        // Dynamic prompt using the parameters
        const prompt = `Job position: ${jobPosition}, Job description: ${jobDescription}, Years of Experience: ${yearOfExperience}. Depending on this info, give me ${process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS} real-life interview questions with answers in JSON format. The JSON should have an array of objects with "question" and "answer" fields.`;

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ];

        // Use generateContent instead of generateContentStream for easier handling
        const response =await ai.models.generateContent({
            model,
            config,
            contents,
        });

        // Log the full response for debugging
        console.log('Gemini API raw response:', response);

        let responseText;
        if (
            response &&
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts[0] &&
            response.candidates[0].content.parts[0].text
        ) {
            responseText = response.candidates[0].content.parts[0].text;
        } else if (
            response &&
            response.responseId &&
            response.responseId.candidates &&
            response.responseId.candidates[0] &&
            response.responseId.candidates[0].content &&
            response.responseId.candidates[0].content.parts &&
            response.responseId.candidates[0].content.parts[0] &&
            response.responseId.candidates[0].content.parts[0].text
        ) {
            responseText = response.responseId.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected Gemini API response:', response);
            return {
                success: false,
                error: 'Unexpected Gemini API response structure',
                rawResponse: JSON.stringify(response, null, 2)
            };
        }

        try {
            const parsedResponse = JSON.parse(responseText);
            return {
                success: true,
                data: parsedResponse
            };
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            return {
                success: false,
                error: 'Failed to parse response as JSON',
                rawResponse: responseText
            };
        }

    } catch (error) {
        console.error('Error generating interview questions:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate interview questions'
        };
    }
}

// Alternative streaming version if you prefer to use streaming
export async function generateInterviewQuestionsStream(jobPosition, jobDescription, yearOfExperience) {
    try {
        const ai = new GoogleGenAI({
            apiKey: GEMINI_API_KEY,
        });

        const config = {
            responseMimeType: 'application/json',
        };

        const model = 'gemini-2.5-flash-preview-04-17';

        const prompt = `Job position: ${jobPosition}, Job description: ${jobDescription}, Years of Experience: ${yearOfExperience}. Depending on this info, give me 5 real-life interview questions with answers in JSON format. The JSON should have an array of objects with "question" and "answer" fields.`;

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ];

        const response = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        let fullResponse = '';
        for await (const chunk of response) {
            fullResponse += chunk.text;
        }

        try {
            const parsedResponse = JSON.parse(fullResponse);
            return {
                success: true,
                data: parsedResponse
            };
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            return {
                success: false,
                error: 'Failed to parse response as JSON',
                rawResponse: fullResponse
            };
        }


    } catch (error) {
        console.error('Error generating interview questions:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate interview questions'
        };
    }
}

export async function testGeminiConnection() {
    try {
        console.log('Testing Gemini connection...');
        const result = await generateInterviewQuestions('Test Position', 'Test Description', '2');
        console.log('Test result:', result);
        return { success: true, data: result };
    } catch (error) {
        console.error('Test error:', error);
        return { success: false, error: error.message };
    }
}