import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderContainer } from "@/components";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <LoaderContainer />;

  if (isSignedIn) return <Outlet />;

  return <Navigate to="/auth" state={{ from: location }} replace />;
}
