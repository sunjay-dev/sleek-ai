import { useEffect, useState } from "react";

export default function useModel() {
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem("selectedModel") || "openai/gpt-oss-120b");

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  return { selectedModel, setSelectedModel };
}
