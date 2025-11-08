import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "../components";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="h-dvh w-dvw flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isSignedIn) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
}