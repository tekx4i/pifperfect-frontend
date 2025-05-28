import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for the token

  if (token) {
    // Redirect to a default authenticated route, e.g., dashboard
    return <Navigate to="/dashboard" />;
  }

  // Render the child components if no token is found
  return <>{children}</>;
};

export default GuestRoute;
