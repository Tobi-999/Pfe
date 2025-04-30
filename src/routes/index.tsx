import React, { Suspense, Fragment } from "react";
import { Routes, Route, RouteProps } from "react-router-dom";
import { Loader } from "lucide-react"; 
import authentication from "./authentication";
import utils from "./utils";
import dashboard from "./dashboard";

type RouteComponent = React.ComponentType<any>;
type RouteGuard = React.ComponentType<any> | typeof Fragment;
type RouteLayout = React.ComponentType<any>;
type CustomRouteItem = {
  component: RouteComponent;
  guard?: RouteGuard;
  layout?: RouteLayout;
} & RouteProps;

export const renderRoutes = (routes: CustomRouteItem[] = []) => (
  <Suspense
    fallback={
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "32px",
          fontWeight: "bold",
          color: "purple",
          textAlign: "center",
          cursor: "pointer",
          
          marginLeft: "50rem", // Move further to the right
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "red")}
        onMouseOut={(e) => (e.currentTarget.style.color = "blue")}
      >
        <Loader size={64} className="animate-spin animate-bounce text-purple-500" /> 
        <span className="animate-fade-in mt-5">Loading...</span>
      </div>
    }
  >
    <Routes>
      {routes.map((route, index) => {
        const Component = route.component;
        const Guard = route.guard || Fragment;
        const Layout = route.layout;

        return (
          <Route
            key={index}
            path={route.path} // /login /register /dashboard
            // guard test to check if the user is authenticated or not
            // layout is the layout of the page
            // component is the component of the page
            element={
              <Guard>
                {Layout ? (
                  <Layout>
                    <Component />
                  </Layout>
                ) : (
                  <Component />
                )}
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes: CustomRouteItem[] = [...dashboard, ...authentication, ...utils];

export default routes;
