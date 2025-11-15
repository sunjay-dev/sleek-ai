import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = `You are an expert AI assistant designed to provide accurate, clear, and concise answers.
Use simple, professional language that is easy for anyone to understand. 
Avoid unnecessary jargon, filler words, or over‑explaining concepts.

If you're unsure about something, respond with:
"I'm sorry, I don't have that information."

When the user asks for code:
- Provide complete, clean, ready‑to‑run code first.
- Add brief explanations only if necessary, to clarify key parts or logic.
- Keep explanations minimal and easy to understand.
- Always follow best practices and modern syntax.

When the user asks for math or LaTeX output:
- Inline math: use $...$ (no \tag, no aligned, simple expressions).
- Block math: use $$...$$ or \$...\$ (can use \tag, aligned, etc.).
- Always use valid LaTeX syntax: \frac{num}{den}, \cdot, \quad / \qquad / \,
- Do not include invalid characters: !, <, commas inside \frac, stray \\.
- Wrap aligned environments properly with & and \\.
- Ensure proofs, sums, induction steps, or multi‑line equations are **block math**.
- Output only Markdown + LaTeX, no HTML or extra escaping.

If the question is ambiguous, politely ask for clarification instead of guessing.`;


class ShortTermMemory {
  private readonly maxSize: number;
  private readonly store: any[] = [];

  constructor(maxSize = 30) {
    this.maxSize = maxSize;
  }

  add(msg: { role: "system" | "user" | "assistant"; content: any[] }) {
    this.store.push(msg);
    if (this.store.length > this.maxSize) {
      this.store.shift();
    }
  }

  getAll() {
    return [{ role: "system", content: [{ type: "input_text", text: systemPrompt }] }, ...this.store];
  }

  clear() {
    this.store.length = 0;
  }
}

const memory = new ShortTermMemory(20);

export const askAI = async (prompt: string, model: string) => {
  memory.add({
    role: "user",
    content: [{ type: "input_text", text: prompt }],
  });

  const response = await client.responses.create({
    model,
    input: memory.getAll(),
  });

  memory.add({
    role: "assistant",
    content: [{ type: "input_text", text: response.output_text }],
  });

  return response.output_text;
};

export const streamAskAI = async (prompt: string, model: string) => {
  memory.add({
    role: "user",
    content: [{ type: "input_text", text: prompt }],
  });

  const stream = client.chat.completions.stream({
    model,
    messages: memory.getAll(),
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      fullResponse += chunk.choices[0].delta.content;
    }
  }
  memory.add({
    role: "assistant",
    content: [{ type: "input_text", text: fullResponse }],
  });

  return stream;
};

export const listModels = async () => {
  const models = await client.models.list();
  return models.data;
};

export const clearMemory = () => memory.clear();
export const getMemorySize = () => memory.getAll().length;