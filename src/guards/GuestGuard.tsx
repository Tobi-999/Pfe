import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context";

const GuestGuard = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isInitialized, user } = useAuthContext();


  if (isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/home" />;
    } else {
      if (user?.is_verified) {
        return <Navigate to="/dashboard" />;
      } else {
        return <Navigate to="/jobs" />;
      }
    }
  }
  return <>{children}</>;
};

export default GuestGuard;
