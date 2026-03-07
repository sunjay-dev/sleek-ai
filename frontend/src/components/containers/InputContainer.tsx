import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, Paperclip, X, AlertCircle, FileText } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";
import { useIsMobile } from "@/hooks";
import { modelsList } from "@app/shared/src/models";
import { useAuth } from "@clerk/clerk-react";
import { useParams, useNavigate } from "react-router-dom";
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
  isRagProcessing?: boolean;
  startRagPolling: () => void;
};

export default function InputContainer({ sendMessage, isGenerating, selectedModel, onStop, onModelChange, autoFocus, isRagProcessing, startRagPolling }: Props) {
  const [message, setMessage] = useState("");
  const { getToken } = useAuth();
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  const processFiles = async (files: File[]) => {
    if (!files.length) return;

    const newAttachments: Attachment[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "uploading",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    const uploadPromises = newAttachments.map(async (attachment) => {
      try {
        const data = await uploadToCloudinary({ file: attachment.file, getToken });

        let newChatId = undefined;
        if (!data.fileType.includes("image")) {
          const token = await getToken();
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/rag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              fileUrl: data.fileUrl,
              fileName: data.fileName,
              fileType: data.fileType,
              chatId: chatId || undefined
            })
          });
          const apiData = await res.json();
          if (apiData.success) {
            startRagPolling();
            if (apiData.chatId && !chatId) {
              newChatId = apiData.chatId;
            }
          }
        }

        setAttachments((prev) =>
          prev.map((item) => (item.id === attachment.id ? { ...item, status: "success", uploadData: data } : item))
        );

        if (newChatId) {
          navigate(`/c/${newChatId}`, { replace: true });
        }
      } catch {
        setAttachments((prev) =>
          prev.map((item) => (item.id === attachment.id ? { ...item, status: "error" } : item))
        );
      }
    });

    await Promise.allSettled(uploadPromises);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      await processFiles(files);
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

    if (isGlobalUploading || isRagProcessing) return;

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

  const processFilesRef = useRef(processFiles);
  useEffect(() => {
    processFilesRef.current = processFiles;
  }, [processFiles]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        await processFilesRef.current(Array.from(files));
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const isGlobalUploading = attachments.some((a) => a.status === "uploading");
  const hasContent = message?.trim().length > 0 || attachments.length > 0;
  const isBusy = isGenerating || isGlobalUploading;

  return (
    <div className="w-full flex justify-center items-center px-4 pb-6 sm:pb-4 bg-transparent relative">
      {isDragging && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none transition-all duration-200">
          <div className="absolute inset-4 sm:inset-6 md:inset-8 border-4 border-dashed border-white/60 rounded-3xl z-0" />
          <div className="bg-white px-6 py-5 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200 z-10">
            <div className="bg-primary/5 p-4 rounded-full">
              <Paperclip size={32} className="text-primary" />
            </div>
            <p className="text-lg font-medium text-primary">Drop files here to attach</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-svw sm:max-w-180 transition-all duration-300 ease-in-out">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-primary px-3 py-2 transition-all duration-200 ease-in-out shadow-md">
            {(attachments.length > 0 || isRagProcessing) && (
              <div className="flex flex-wrap gap-2 mb-2 pl-1 items-center">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group">
                    {att.file.type.startsWith("image/") ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(att.file)}
                          alt="Preview"
                          className={`h-16 w-auto rounded-lg object-contain border border-gray-100 transition-all ${att.status === "uploading" ? "opacity-50 blur-[1px]" : ""
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

                {isRagProcessing && (
                  <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 font-medium">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing document...</span>
                  </div>
                )}
              </div>
            )}

            <textarea
              autoFocus={autoFocus}
              name="input field"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={isBusy}
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
                  className={`flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 hover:border-transparent active:border-transparent hover:bg-[#e9e9e980] active:bg-[#e9e9e980] text-primary cursor-pointer ${isBusy ? "opacity-50 pointer-events-none" : ""
                    }`}
                  title="Attach files"
                >
                  <Paperclip size={isMobile ? 20 : 16} strokeWidth={1.8} />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <ModelSelector models={modelsList} selectedModel={selectedModel} onModelChange={onModelChange} isGenerating={isGenerating} />

                <button
                  type="submit"
                  disabled={(!hasContent && !isGenerating) || isGlobalUploading || isRagProcessing}
                  className={`
                  flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200
                  ${isBusy || hasContent
                      ? "bg-secondary text-white hover:bg-neutral-700 active:bg-neutral-700"
                      : "bg-[#e9e9e980] text-[#6f6f6f] cursor-not-allowed"
                    }
                `}
                >
                  {isGenerating || isGlobalUploading || isRagProcessing ? <Loader2 size={isMobile ? 20 : 16} className="animate-spin" /> : <ArrowUp size={isMobile ? 22 : 18} strokeWidth={2.5} />}
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
