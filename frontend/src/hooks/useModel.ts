import { useEffect, useState } from "react";

export default function useModel() {
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem("selectedModel") || "moonshotai/kimi-k2-instruct-0905");

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  return { selectedModel, setSelectedModel };
}
