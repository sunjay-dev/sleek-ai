import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const systemPrompt = `You are an expert AI assistant designed to provide accurate, clear, and concise answers.
Use simple, professional language that is easy for anyone to understand. 
Avoid unnecessary jargon, filler words, or over-explaining concepts.

If you're unsure about something, respond with:
"I'm sorry, I don't have that information."

When the user asks for code:
- Provide the complete, clean, and ready-to-run code first.
- Add a brief explanation **only if necessary** to clarify key parts or logic.
- Keep explanations minimal and easy to understand.
- Always follow best practices and modern syntax.

If the question is ambiguous, politely ask for clarification instead of guessing.`;



const messages: any[] = [
    {
        role: "system",
        content: [
            { type: "input_text", text: systemPrompt },
        ],
    },
];

export const askAI = async (prompt: string, model: string) => {
    messages.push({
        role: "user",
        content: [
            { type: "input_text", text: prompt },
        ],
    });

    const response = await client.responses.create({
        model,
        input: messages
    });

    messages.push({
        role: "assistant",
        content: [
            { type: "input_text", text: response.output_text },
        ],
    });

    return response.output_text;
};

export const streamAskAI = async (prompt: string, model: string) => {
    messages.push({
        role: "user",
        content: [
            { type: "input_text", text: prompt },
        ],
    });

    return client.chat.completions.stream({
        model,
        messages: [
            { role: "system", content: "You are a concise, helpful AI assistant." },
            { role: "user", content: prompt },
        ],
    });
};

export const listModels = async () => {
    const models = await client.models.list();
    return models.data;
}