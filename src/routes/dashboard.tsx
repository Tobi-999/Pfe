import { lazy } from "react";

// TODO FINISH ALL THE ROUTING SYSTEM OF YOUR APPLICATION

const routes = [
  {
    exact: true,
    path: "/jobs",
    component: lazy(() => import("../pages/dashboard/jobs/Jobs")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/jobs/create",
    component: lazy(() => import("../pages/dashboard/jobs/AddJob")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
];

export default routes;
