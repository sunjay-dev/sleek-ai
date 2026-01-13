export const MODELS = new Map([
  ["openai/gpt-oss-120b", { tpm: 6_000, tpd: 200_000, rpm: 30 }],
  ["openai/gpt-oss-20b", { tpm: 6_000, tpd: 200_000, rpm: 30 }],
  ["qwen/qwen3-32b", { tpm: 4_000, tpd: 500_000, rpm: 60 }],
  ["llama-3.3-70b-versatile", { tpm: 12_000, tpd: 100_000, rpm: 30 }],
  ["meta-llama/llama-4-scout-17b-16e-instruct", { tpm: 40_000, tpd: 500_000, rpm: 30 }],
  ["moonshotai/kimi-k2-instruct-0905", { tpm: 15_000, tpd: 300_000, rpm: 60 }],
]);

export const modelsList = [...MODELS.keys()];
