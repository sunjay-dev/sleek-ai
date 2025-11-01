import OpenAI from "openai";
import type { ResponseInput } from "openai/resources/responses/responses.mjs";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});


export const askAI = async (prompt: string | ResponseInput | undefined) => {
    const response = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: prompt,
    });
    return response.output_text;
};
