import { lazy } from "react";

/// guest routes login and register
// in this case we are using a check that test if the user is authenticated or not
// if the user is authenticated, we redirect to the home page
// if the user is not authenticated, we redirect to the login page
// if the user is not authenticated, we redirect to the register page
// if the user is not authenticated, we redirect to the login page
// if the user is not authenticated, we redirect to the register page
// if the user is not authenticated, we redirect to the login page

const routes = [
  {
    exact: true,
    path: "/login",
    component: lazy(() => import("../pages/auth/login/Login")),
    guard: lazy(() => import("../guards/GuestGuard")),
  },
  {
    exact: true,
    path: "/signup",
    component: lazy(() => import("../pages/auth/register/SignUp")),
    guard: lazy(() => import("../guards/GuestGuard")),
  },
];

export default routes;
