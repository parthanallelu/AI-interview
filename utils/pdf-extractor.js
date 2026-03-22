const pdf = require('pdf-parse');

/**
 * Extracts text from a PDF Buffer
 * @param {Buffer} dataBuffer - The PDF file as a Buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromPDF(dataBuffer) {
    try {
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from resume. Please try a different PDF.");
    }
}
