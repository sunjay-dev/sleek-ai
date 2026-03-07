import { useUser } from "@clerk/clerk-react";
import { PenTool } from "lucide-react";
import InputContainer from "./containers/InputContainer";
import type { UploadedFile } from "@app/shared/src/types";

type Props = {
  sendMessage: (text: string, selectedModel: string, messageFiles?: UploadedFile[] | null) => void;
  isGenerating: boolean;
  selectedModel: string;
  onStop: () => void;
  onModelChange: (modelId: string) => void;
  isRagProcessing?: boolean;
  startRagPolling: () => void;
};

const SUGGESTIONS = [
  {
    label: "Draft a blog post",
    prompt: "Write a blog post about productivity tips.",
    icon: PenTool,
  },
  { label: "Debug code", prompt: "Help me find the bug in this code snippet." },
  { label: "Creative ideas", prompt: "Give me 5 creative ideas for a startup." },
  { label: "Explain quantum physics", prompt: "Explain quantum physics in simple terms." },
];

export default function WelcomeScreen({ sendMessage, isGenerating, selectedModel, onStop, onModelChange, isRagProcessing, startRagPolling }: Props) {
  const { user, isLoaded } = useUser();

  const getGreetingName = () => {
    if (!isLoaded || !user) return "there";
    return `${user.firstName || ""}`.trim() || "there";
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt, selectedModel);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex-1 flex flex-col justify-center w-full px-4 space-y-8 min-h-0">
        <div className="w-full pl-2 md:pl-7 space-y-2">
          <span className="text-xl text-gray-900/90 font-medium">👋 Hi, {getGreetingName()}</span>
          <h1 className="text-3xl font-medium text-[#1c1c1c] tracking-tight">Where should we start?</h1>
        </div>

        <div className="flex flex-wrap gap-2.5 w-full pl-2 md:pl-7">
          {SUGGESTIONS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(item.prompt)}
              disabled={isGenerating || isRagProcessing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white
                border-primary rounded-full transition-all duration-200 hover:bg-white/90"
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <InputContainer
        sendMessage={sendMessage}
        isGenerating={isGenerating}
        selectedModel={selectedModel}
        onStop={onStop}
        onModelChange={onModelChange}
        autoFocus={true}
        isRagProcessing={isRagProcessing}
        startRagPolling={startRagPolling}
      />
    </div>
  );
}
