import { type Context } from "hono";
import { streamAskAI, askAI, listModels } from "../config/groq.config.js";
import { streamText } from "hono/streaming";

export async function handleStreamAIResponse(c: Context) {
    const { query, model = 'gpt-oss-120b' } = await c.req.json();

    const stream = await streamAskAI(query, model);

    return streamText(c, async (writer) => {
        for await (const chunk of stream) {
            const text = chunk.choices?.[0]?.delta?.content;
            if (text) {
                await writer.write(text);
            }
        }
    });
};

export async function handleAIResponse(c: Context) {
    const { query, model = 'openai/gpt-oss-120b' } = await c.req.json();

    const response = await askAI(query, model);
    return c.json({ response, isAI: true }, 200);
};

export async function handleListModels(c: Context) {
    const models = await listModels();
    return c.json({ models }, 200);
};