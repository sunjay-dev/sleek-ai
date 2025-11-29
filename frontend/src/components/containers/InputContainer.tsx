import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Upload, Loader2, Paperclip, X } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
import { type Model } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';

type Props = {
  sendMessage: (text: string, file?: File | null) => void
  isLoading: boolean
  models: Model[]
  selectedModel: string
  onStop: () => void
  onModelChange: (modelId: string) => void
}

export default function InputContainer({ sendMessage, isLoading, models, selectedModel, onStop, onModelChange }: Props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading || (!message.trim() && !file)) return;

    sendMessage(message.trim(), file);
    setMessage("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  }

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="w-full flex justify-center items-center px-4 pb-4 bg-primary">
      <div className="w-full max-w-180">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-white/20 px-3 py-2 shadow-md">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={2}
              className="w-full bg-white py-1 px-1.5 text-primary text-sm focus:outline-none resize-none placeholder:text-primary mb-1 overflow-y-auto max-h-28 no-scrollbar"
            />

            {file && (
              <div className="space-y-2">
                {file.type.startsWith('image/') && (
                  <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-20 rounded-md" />
                )}
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
              <div className="flex items-center gap-2">
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onModelChange={onModelChange}
                  isLoading={isLoading}
                />
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-1 icon-bg hover:bg-neutral-600 px-2 py-1 rounded-md cursor-pointer"
                  >
                    <Upload size={14} /> Upload
                  </label>
                </div>
              </div>

              <button
                type="submit"
                onClick={isLoading ? onStop : undefined}
                disabled={!isLoading && !message.trim() && !file}
                className="flex items-center gap-1 bg-neutral-800 text-white hover:bg-neutral-700 px-3 py-1 rounded-md disabled:bg-[#e9e9e980] disabled:text-[#6f6f6f] disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <>Send <SendHorizontal size={14} /></>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}