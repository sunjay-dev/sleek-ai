import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { lazy, Suspense } from "react";
import { Loader } from "@/components";

const ChatPage = lazy(() => import("@/page/ChatPage.tsx"));
const AuthPage = lazy(() => import("@/page/AuthPage.tsx"));

export const routes = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
      {
        path: "/c/:chatId",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/auth/*",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthPage />
      </Suspense>
    ),
  },
]);
