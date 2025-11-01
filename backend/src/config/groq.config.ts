import OpenAI from "openai";
import type { ResponseInput } from "openai/resources/responses/responses.mjs";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});


export const askAI = async (prompt: string | ResponseInput | undefined, model: string) => {
    const response = await client.responses.create({
        model: model,
        input: prompt,
    });
    return response.output_text;
};


export const listModels = async () => {
    const models = await client.models.list();
    return models.data;
}