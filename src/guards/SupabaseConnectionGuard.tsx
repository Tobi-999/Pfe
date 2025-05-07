import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/supabase/supaBaseConnectionCtx";

// Define common pages that are accessible to all roles
const commonPages = [
  "/jobs",
  "/users",
  "/profile",
  "/settings",
  "/leaves",
  "/recordings",
  "/registrations",
  "/vue-more/1",
  "/home",
  "/CreateEmployee",

];

// Define role-specific pages
const rolePages = {
  admin: ["/home", "/jobs", "/leaves", "/recordings", "registrations","/vue-more/1"],
  employee: {
    verified: ["/users", "/leaves", "/recordings","jobs" ,"/vue-more/1" ,"/home","/CreateEmployee"],
    unverified: ["/jobs", "/leaves", "/recordings", "/jobs","/vue-more/1","/home","/CreateEmployee"],
  },
};

export default function SupabaseConnectionGuard({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("innn");
    if (!isInitialized && isAuthenticated && user) {
      const userRole = user.role || "employee";
      const currentPath = location.pathname;

      console.log({ currentPath, userRole, isVerified: user.is_verified });
      // Check if the current page is accessible to the user
      const isCommonPage = commonPages.some((page) =>
        currentPath.startsWith(page)
      );

      let isRoleSpecificPage = false;
      if (userRole === "admin") {
        isRoleSpecificPage = rolePages.admin.some((page) =>
          currentPath.startsWith(page)
        );
      } else {
        // For employees, check verification status
        const employeePages = user.is_verified
          ? rolePages.employee.verified
          : rolePages.employee.unverified;
        isRoleSpecificPage = employeePages.some((page) =>
          currentPath.startsWith(page)
        );
      }

      if (!isCommonPage && !isRoleSpecificPage) {
        // Redirect to appropriate home page based on role and verification status
        if (userRole === "admin") {
          navigate("/home");
        } else {
          // For employees, redirect based on verification status
          if (user.is_verified) {
            navigate("/users");
          } else {
            navigate("/verification");
          }
        }
      }
    }
  }, [isInitialized, isAuthenticated, user, location.pathname, navigate]);

  if (isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
