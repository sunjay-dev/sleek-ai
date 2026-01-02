import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { LoaderContainer } from "@/components";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoaderContainer />;

  if (isSignedIn) return <Outlet />;

  return <Navigate to="/auth" replace />;
}
