import { type Context } from "hono";
import { streamText } from "hono/streaming";
import { askAI, streamAskAI } from "../utils/model.utils.js";

export async function handleAIResponse(c: Context) {
  const { query, model = "openai/gpt-oss-120b" } = await c.req.json();

  const userId = c.get("user");

  const response = await askAI(query, userId, model);
  return c.json({ response, isAI: true }, 200);
}

export async function handleStreamAIResponse(c: Context) {
  const { query, model = "openai/gpt-oss-120b" } = await c.req.json();
  const userId = c.get("user");

  return streamText(c, async (stream) => {
    try {
      const eventStream = await streamAskAI(query, userId, model);

      for await (const event of eventStream) {
        if (event.event === "on_chat_model_stream" && event.data.chunk.content) {
          await stream.write(event.data.chunk.content);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      await stream.write("\n[Error generating response]");
    }
  });
}
