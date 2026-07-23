import { toast } from "sonner";

type ApiOptions = RequestInit & {
  successMessage?: string;
};

export async function apiRequest(url: string, options: ApiOptions = {}) {
  const { successMessage, ...fetchOptions } = options;

  try {
    const res = await fetch(url, fetchOptions);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = data.message || data.error || "Something went wrong, Please try again later.";
      throw new Error(errorMessage);
    }

    if (successMessage) toast.success(successMessage);

    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Network Error";
    toast.error(msg);
    return;
  }
}
