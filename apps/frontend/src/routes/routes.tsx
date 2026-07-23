import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { lazy } from "react";
import { LazyLoader, LoaderContainer, RootLayout } from "@/components";

const ChatPage = lazy(() => import("@/page/ChatPage.js"));
const AuthPage = lazy(() => import("@/page/AuthPage.js"));

export const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: (
          <LazyLoader fallback={<LoaderContainer />}>
            <ProtectedRoute />
          </LazyLoader>
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
          <LazyLoader fallback={<LoaderContainer />}>
            <AuthPage />
          </LazyLoader>
        ),
      },
    ],
  },
]);
