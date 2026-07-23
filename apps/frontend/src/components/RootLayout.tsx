import { Toaster } from "@/components/ui/sonner";
import GlobalErrorObserver from "./GlobalErrorObserver";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <GlobalErrorObserver />

      <Toaster position="top-center" closeButton />

      <Outlet />
    </>
  );
}
