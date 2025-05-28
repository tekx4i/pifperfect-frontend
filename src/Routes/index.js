import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

// Routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";
import GuestRoute from "./guestRoute"; // Import GuestRoute

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <GuestRoute>
                <NonAuthLayout>{route.component}</NonAuthLayout>
              </GuestRoute>
            }
            key={idx}
          />
        ))}

        {/* Authenticated Routes */}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}  // Relative path for each route
            element={
              <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
              </AuthProtected>
            }
            key={idx}
          >
            {route.children &&
              route.children.map((childRoute, childIdx) => (
                <Route
                  key={childIdx}
                  path={childRoute.path}  // Child route with relative path
                  element={childRoute.component}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default Index;
