import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, Paperclip, X, AlertCircle, FileText } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import { useIsMobile } from "@/hooks";
import { modelsList } from "@app/shared/src/models";
import { useAuth } from "@clerk/clerk-react";
import type { UploadedFile } from "@app/shared/src/types";
import { uploadToCloudinary } from "@/utils/cloudinary";

type Attachment = {
  id: string;
  file: File;
  status: "uploading" | "success" | "error";
  uploadData?: UploadedFile;
};

type Props = {
  sendMessage: (text: string, selectedModel: string, messageFiles: UploadedFile[], optimisticFiles?: UploadedFile[]) => void;
  isGenerating: boolean;
  selectedModel: string;
  onStop: () => void;
  onModelChange: (modelId: string) => void;
  autoFocus: boolean;
};

export default function InputContainer({ sendMessage, isGenerating, selectedModel, onStop, onModelChange, autoFocus }: Props) {
  const [message, setMessage] = useState("");
  const { getToken } = useAuth();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const newAttachments: Attachment[] = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "uploading",
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);

      newAttachments.forEach(async (attachment) => {
        try {
          const data = await uploadToCloudinary({ file: attachment.file, getToken });

          setAttachments((prev) => prev.map((item) => (item.id === attachment.id ? { ...item, status: "success", uploadData: data } : item)));
        } catch {
          setAttachments((prev) => prev.map((item) => (item.id === attachment.id ? { ...item, status: "error" } : item)));
          throw new Error(`Failed to upload ${attachment.file.name}`);
        }
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (idToRemove: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== idToRemove));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isGenerating) {
      onStop();
      return;
    }

    if (isGlobalUploading) return;

    const successfulUploads = attachments.filter((a) => a.status === "success" && a.uploadData).map((a) => a.uploadData!);

    if (!message.trim() && successfulUploads.length === 0) return;

    const optimisticUploads = attachments
      .filter((a) => a.status === "success" && a.uploadData)
      .map((a) => ({
        ...a.uploadData!,
        fileUrl: URL.createObjectURL(a.file),
      }));

    sendMessage(message.trim(), selectedModel, successfulUploads, optimisticUploads);

    setMessage("");
    setAttachments([]);

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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const isGlobalUploading = attachments.some((a) => a.status === "uploading");
  const hasContent = message?.trim().length > 0 || attachments.length > 0;
  const isBusy = isGenerating || isGlobalUploading;

  return (
    <div className="w-full flex justify-center items-center px-4 pb-4 bg-transparent">
      <div className="w-full max-w-svw sm:max-w-180 transition-all duration-300 ease-in-out">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-primary px-3 py-2 transition-all duration-200 ease-in-out shadow-md">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2 pl-1">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group">
                    {att.file.type.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(att.file)}
                          alt="Preview"
                          className={`h-16 w-auto rounded-lg object-contain border border-gray-100 transition-all ${
                            att.status === "uploading" ? "opacity-50 blur-[1px]" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="absolute -top-1.5 -right-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-0.5 shadow-sm border border-gray-200 transition-colors z-10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-fit max-w-full">
                        <div className="bg-white p-1.5 rounded-md border border-gray-200 shadow-sm">
                          <FileText size={16} className="text-primary" />
                        </div>
                        <span className="truncate text-xs text-primary max-w-24 font-medium">{att.file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="ml-1 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {att.status === "uploading" && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-white/80 rounded-full p-1 shadow-sm">
                          <Loader2 size={16} className="animate-spin text-primary" />
                        </div>
                      </div>
                    )}

                    {att.status === "error" && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-red-50/30 rounded-lg">
                        <div className="bg-white rounded-full p-1 shadow-sm border border-red-100">
                          <AlertCircle size={16} className="text-red-500" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <textarea
              autoFocus={autoFocus}
              name="input field"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Anything"
              rows={1}
              className="w-full custom-scroll custom-scroll-xs py-2 px-1.5 text-primary text-sm focus:outline-none resize-none overflow-y-auto max-h-28 transition-all duration-200 ease-in-out"
            />

            <div className="flex justify-between items-center gap-2 border-t border-white/10 pt-2 text-xs text-white">
              <div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  max={5}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isBusy}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-transparent active:border-transparent hover:bg-[#e9e9e980] active:bg-[#e9e9e980] text-primary cursor-pointer ${
                    isBusy ? "opacity-50 pointer-events-none" : ""
                  }`}
                  title="Attach files"
                >
                  <Paperclip size={16} strokeWidth={1.8} />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <ModelSelector models={modelsList} selectedModel={selectedModel} onModelChange={onModelChange} isGenerating={isGenerating} />

                <button
                  type="submit"
                  disabled={(!hasContent && !isGenerating) || isGlobalUploading}
                  className={`
                  flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200
                  ${
                    isBusy || hasContent
                      ? "bg-secondary text-white hover:bg-neutral-700 active:bg-neutral-700"
                      : "bg-[#e9e9e980] text-[#6f6f6f] cursor-not-allowed"
                  }
                `}
                >
                  {isGenerating || isGlobalUploading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={18} strokeWidth={2.5} />}
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
