import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Sparkles, Box } from "lucide-react";
import type { Model } from "@/types";

type Props = {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isGenerating: boolean;
};

export default function ModelSelector({ models, selectedModel, onModelChange, isGenerating }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentModel = models.find((m) => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onModelChange(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => !isGenerating && setIsOpen(!isOpen)}
        disabled={isGenerating}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
          ${
            isOpen
              ? "bg-gray-100 border-gray-300 text-primary"
              : "bg-transparent border-transparent hover:bg-gray-100 text-gray-500 hover:text-primary"
          }
          ${isGenerating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <Sparkles size={14} className={isOpen || selectedModel ? "text-primary" : "text-gray-400"} />
        <span className="truncate max-w-30">{currentModel?.name || "Select Model"}</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Available Models</span>
          </div>

          <div className="p-1 max-h-60 overflow-y-auto">
            {models.map((model) => {
              const isActive = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between
                    ${isActive ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Box size={14} className={isActive ? "text-primary" : "text-primary opacity-80"} />
                    <span className={`font-medium ${isActive ? "text-primary" : "text-primary opacity-90"}`}>{model.name}</span>
                  </div>
                  {isActive && <Check size={14} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
