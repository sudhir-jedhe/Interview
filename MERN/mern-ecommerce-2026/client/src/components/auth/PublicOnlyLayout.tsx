import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Commonloader } from "../common/Loader";

export function PublicOnlyLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped, status } = useAuthStore();
  const location = useLocation();

  if (!isLoaded) null;

  if (isSignedIn && (!isBootstrapped || status === "loading")) {
    return <Commonloader />;
  }

  if (
    isSignedIn &&
    (location.pathname === "/sign-in" || location.pathname === "sign-up")
  ) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
}
