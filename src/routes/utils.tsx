import { lazy } from "react";

const routes = [
  {
    exact: true,
    path: "*",
    component: lazy(() => import("../pages/error/NotFound")),
  },
];

export default routes;
