import { toast } from "sonner";
import { z } from "@app/shared/src/index.js";

export function validate<T extends z.ZodTypeAny>(schema: T, data: z.input<T>, customMessage?: string): z.output<T> | undefined {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    toast.error(customMessage ?? parseResult.error.issues[0].message);
    return undefined;
  }
  return parseResult.data;
}
