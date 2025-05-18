import { Component } from "lucide-react";
import { lazy } from "react";

const routes = [
  {
    exact: true,
    path: "/jobs",
    component: lazy(() => import("../pages/Dashboard/jobs/Jobs")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/jobs/create",
    component: lazy(() => import("../pages/Dashboard/jobs/AddJob")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/vue-more/:id",
    component: lazy(() => import("../pages/Dashboard/jobs/ReadJobs")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/leaves",
    component: lazy(() => import("../pages/Dashboard/leaves/Leaves")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/recordings",
    component: lazy(() => import("../pages/Dashboard/recording/Recordings")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },

  {
    exact: true,
    path: "/registrations",
    component: lazy(
      () => import("../pages/Dashboard/registrations/Registrations")
    ),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/settings",
    component: lazy(() => import("../pages/Dashboard/Settings/Settings")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/home",
    component: lazy(() => import("../pages/Dashboard/Home/Home")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/users",
    component: lazy(() => import("../pages/Dashboard/Home/UserHome")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/vue-more/:id",
    component: lazy(() => import("../pages/Dashboard/registrations/VueMore")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/portfolio",
    component: lazy(() => import("../pages/Dashboard/Home/VuePortfolio")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },

  {
    exact: true,
    path: "/employee",
    component: lazy(() => import("../pages/Dashboard/Employee/Employee")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
  {
    exact: true,
    path: "/jobs/apply/:id",
    component: lazy(() => import("../pages/Dashboard/Employee/CreateEmployee")),
    layout: lazy(() => import("../layout/Dashboard")),
    guard: lazy(() => import("../guards/SupabaseConnectionGuard")),
  },
   

];

export default routes;
