import { type Context } from "hono";
import { askAI, listModels } from "../config/groq.config";

export async function handleAskAI (c: Context) {
    const { query, model = 'gpt-oss-120b' } = await c.req.json();
    const response = await askAI(query, model);
    return c.json({ response, isAI: true });
};

export async function handleListModels (c: Context) {
    const models = await listModels();
    return c.json({ models });
};