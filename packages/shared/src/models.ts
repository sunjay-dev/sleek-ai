// 9router handles model routing automatically.
// The model selector is removed from the frontend.
// These models are kept for reference/backward compatibility.

export const MODELS = [
  {
    id: "auto",
    name: "Auto (9router)",
    tpm: 10_000,
    tpd: 500_000,
    rpm: 60,
  },
] as const;

export const modelsList = MODELS.map((model) => ({ id: model.id, name: model.name }));
export const modelsId = MODELS.map((m) => m.id);
