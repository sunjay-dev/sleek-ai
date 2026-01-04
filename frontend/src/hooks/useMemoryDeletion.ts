import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { UserMemory } from "@/types";

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

    const token = await getToken();
    if (!token) throw new Error("No token found");

    try {
      if (intent.type === "single") {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories/${intent.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to delete memory");
            setMemories((prev) => (prev ? prev.filter((m) => m.id !== intent.id) : []));
            setIntent(null);
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to delete memory.");
          });
      }
      if (intent.type === "all") {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to clear memories");
            setMemories([]);
            setIntent(null);
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to clear memories.");
          });
      }
    } catch (err) {
      console.error(err);
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
