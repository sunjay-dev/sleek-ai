export const MODELS = new Map([
  ["openai/gpt-oss-120b", { tpm: 8000, tpd: 200000, rpm: 30 }],
  ["openai/gpt-oss-20b", { tpm: 8000, tpd: 200000, rpm: 30 }],
  ["qwen/qwen3-32b", { tpm: 6000, tpd: 500000, rpm: 60 }],
  ["llama-3.3-70b-versatile", { tpm: 12000, tpd: 100000, rpm: 30 }],
  ["meta-llama/llama-4-scout-17b-16e-instruct", { tpm: 30000, tpd: 500000, rpm: 30 }],
  ["moonshotai/kimi-k2-instruct-0905", { tpm: 10000, tpd: 300000, rpm: 60 }],
]);

export const modelsList = [...MODELS.keys()];
