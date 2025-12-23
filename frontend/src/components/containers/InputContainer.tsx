import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, Paperclip, X } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import { useIsMobile } from "@/hooks/useIsMobile";
import { models } from "@/data/models";

type Props = {
  sendMessage: (text: string, file?: File | null) => void;
  isGenerating: boolean;
  selectedModel: string;
  onStop: () => void;
  onModelChange: (modelId: string) => void;
};

export default function InputContainer({ sendMessage, isGenerating, selectedModel, onStop, onModelChange }: Props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isGenerating) {
      onStop();
      return;
    }
    if (!message.trim() && !file) return;

    sendMessage(message.trim(), file);
    setMessage("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const hasContent = message.trim().length > 0 || file !== null;

  return (
    <div className="w-full flex justify-center items-center px-4 pb-4 bg-primary">
      <div className="w-full max-w-svw sm:max-w-180 transition-all duration-300 ease-in-out">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-500/20 px-3 py-2 shadow-md">
            <textarea
              name="input field"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Anything"
              rows={1}
              className="w-full bg-white py-2 px-1.5 text-primary text-sm focus:outline-none resize-none placeholder:text-primary overflow-y-auto max-h-28 no-scrollbar transition-all duration-200 ease-in-out"
            />

            {file && (
              <div className="space-y-2 mb-2">
                {file.type.startsWith("image/") && <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-20 rounded-md" />}
                <div className="flex items-center gap-2 icon-bg/50 px-2 py-1 rounded-md text-xs text-primary">
                  <Paperclip size={14} />
                  <span className="truncate flex-1">{file.name}</span>
                  <button type="button" onClick={handleRemoveFile} className="p-1 hover:bg-[#e9e9e980] rounded-full">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center gap-2 border-t border-white/10 pt-2 text-xs text-white">
              <div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-transparent hover:bg-[#e9e9e980] text-primary cursor-pointer transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={16} strokeWidth={1.8} />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <ModelSelector models={models} selectedModel={selectedModel} onModelChange={onModelChange} isGenerating={isGenerating} />

                <button
                  type="submit"
                  disabled={!isGenerating && !hasContent}
                  className={`
                  flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200
                  ${
                    isGenerating || hasContent ? "bg-neutral-800 text-white hover:bg-neutral-700" : "bg-[#e9e9e980] text-[#6f6f6f] cursor-not-allowed"
                  }
                `}
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={18} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">AI can make mistakes. Check important info.</p>
        </div>
      </div>
    </div>
  );
}
