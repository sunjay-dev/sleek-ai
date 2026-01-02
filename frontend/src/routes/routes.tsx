import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import { lazy, Suspense } from "react";
import { ErrorPage, LoaderContainer } from "@/components";
import { ErrorBoundary } from "react-error-boundary";

const ChatPage = lazy(() => import("@/page/ChatPage.tsx"));
const AuthPage = lazy(() => import("@/page/AuthPage.tsx"));

export const routes = createBrowserRouter([
  {
    element: (
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<LoaderContainer />}>
          <ProtectedRoute />
        </Suspense>
      </ErrorBoundary>
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
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<LoaderContainer />}>
          <AuthPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },
]);
