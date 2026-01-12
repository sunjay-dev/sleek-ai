import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { UserMemory } from "@/types";
import { apiRequest } from "@/utils/api";

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
        url = `${import.meta.env.VITE_BACKEND_URL}/api/user/memories/${intent.id}`;
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
    } catch (err) {
      console.error(err);
      alert("Failed to delete memory.");
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
