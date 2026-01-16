import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { UserMemory } from "@app/shared/src/types";
import { apiRequest } from "@/utils/api";
import { validate } from "@/utils/validate";
import { memoryIdParamSchema } from "@app/shared/src/schemas/memory.schema.js";
import { toast } from "sonner";

export type MemoryDeleteIntent = { type: "single"; id: string } | { type: "all" } | null;

export default function useMemoryDeletion(setMemories: Dispatch<SetStateAction<UserMemory[] | null>>) {
  const { getToken } = useAuth();
  const [intent, setIntent] = useState<MemoryDeleteIntent>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDeleteMemory = (id: string) => setIntent({ type: "single", id });
  const requestDeleteAllMemories = () => setIntent({ type: "all" });
  const cancel = () => setIntent(null);

  async function confirm() {
    if (!intent) return;
    setIsDeleting(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("You must be logged in to delete memory.");

      let url = "";
      if (intent.type === "single") {
        const result = validate(memoryIdParamSchema, { memoryId: intent.id }, "Please refresh the page and try again.");
        if (!result) {
          setIsDeleting(false);
          return;
        }

        url = `${import.meta.env.VITE_BACKEND_URL}/api/user/memories/${result.memoryId}`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/user/memories`;
      }

      await apiRequest(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        successMessage: `${intent.type === "single" ? "Memory" : "Memories"} deleted successfully!`,
      });

      if (intent.type === "single") {
        setMemories((prev) => (prev ? prev.filter((m) => m.id !== intent.id) : []));
      } else {
        setMemories([]);
      }

      setIntent(null);
    } catch {
      toast.error("Oops!, Failed to delete memory.");
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    intent,
    isDeleting,
    requestDeleteMemory,
    requestDeleteAllMemories,
    confirm,
    cancel,
  };
}
