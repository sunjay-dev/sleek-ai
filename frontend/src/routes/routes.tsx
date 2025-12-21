import { createBrowserRouter } from "react-router-dom";
import { ChatPage, AuthPage } from "@/page";
import ProtectedRoute from "./ProtectedRoutes";

export const routes = createBrowserRouter([
  {
    element: <ProtectedRoute />,
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
    element: <AuthPage />,
  },
]);
