export const MODELS = [
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    tpm: 6_000,
    tpd: 200_000,
    rpm: 30,
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    tpm: 6_000,
    tpd: 200_000,
    rpm: 30,
  },
  {
    id: "qwen/qwen3-32b",
    name: "Qwen 3 32B",
    tpm: 4_000,
    tpd: 500_000,
    rpm: 60,
  },
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    tpm: 12_000,
    tpd: 100_000,
    rpm: 30,
  },
  {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout",
    tpm: 40_000,
    tpd: 500_000,
    rpm: 30,
  },
  {
    id: "moonshotai/kimi-k2-instruct-0905",
    name: "Kimi K2",
    tpm: 15_000,
    tpd: 300_000,
    rpm: 60,
  },
] as const;

export const modelsList = MODELS.map((model) => ({ id: model.id, name: model.name }));
export const modelsId = MODELS.map((m) => m.id);
