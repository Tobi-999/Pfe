import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context";

const GuestGuard = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();

  const { isAuthenticated, isInitialized, user } = useAuthContext();

  if (isInitialized) {
    return <div>loaderrrrr</div>;
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to={"/home"} />;
    }
    if (user?.role === "employee") {
      return <Navigate to={"/users"} />;
    }
  }

  console.log("teststst");

  return <>{children}</>;
};

export default GuestGuard;
