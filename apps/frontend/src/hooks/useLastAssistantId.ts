import { useMemo } from "react";
import type { Message } from "@app/shared/src/types";

export default function useLastAssistantId(messages: Message[]): string | undefined {
  return useMemo(() => {
    const last = [...messages].reverse().find((m) => m.role === "ASSISTANT");
    return last?.id;
  }, [messages]);
}
