import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context";

const GuestGuard = ({ children }: { children: React.ReactElement }) => {
  const navigate = useNavigate();

  const { isAuthenticated, isInitialized } = useAuthContext();

  console.log({ isAuthenticated, isInitialized });

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  if (isInitialized) {
    return <div>loaderrrrr</div>;
  }

  console.log("teststst");

  return <>{children}</>;
};

export default GuestGuard;
