import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/supabase/supaBaseConnectionCtx";

export default function SupabaseConnectionGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  if (isInitialized) {
    return <div>loaderrrrr</div>;
  }

  return <> {children} </>;
}
