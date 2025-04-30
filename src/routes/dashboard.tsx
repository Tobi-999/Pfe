import { Component } from "lucide-react";
import { lazy } from "react";

const routes = [
  {
    exact: true,
    path: "/jobs",
    component: lazy(() => import("../pages/Dashboard/jobs/Jobs")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/jobs/create",
    component: lazy(() => import("../pages/Dashboard/jobs/AddJob")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/jobs/read/:id",
    component: lazy(() => import("../pages/Dashboard/jobs/ReadJobs")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/leaves",
    component: lazy(() => import("../pages/Dashboard/leaves/Leaves")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/recordings",
    component: lazy(() => import("../pages/Dashboard/recording/Recordings")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },

  {
    exact: true,
    path: "/registrations",
    component: lazy(
      () => import("../pages/Dashboard/registrations/Registrations")
    ),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/settings",
    component: lazy(() => import("../pages/Dashboard/Settings/Settings")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/home",
    component: lazy(() => import("../pages/Dashboard/Home/Home")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/home/users",
    component: lazy(() => import("../pages/Dashboard/Home/UserHome")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/home/view-more",
    component: lazy(() => import("../VueMore")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/home/portfolio",
    component: lazy(() => import("../pages/Dashboard/Home/VuePortfolio.tsx")),
    layout: lazy(() => import("../layout/Dashboard")),
    // guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
];

export default routes;
