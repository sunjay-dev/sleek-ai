import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalErrorObserver() {
  useEffect(() => {
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);

      toast.error("An unexpected error occurred", {
        description: message,
      });
    };

    const handleError = (event: ErrorEvent) => {
      toast.error("Application Error", {
        description: event.message,
      });
    };

    window.addEventListener("unhandledrejection", handlePromiseRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
