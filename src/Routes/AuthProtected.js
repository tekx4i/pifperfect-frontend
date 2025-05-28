import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useUserInfo } from "../Context/UserContext";

const AuthProtected = (props) => {
  const token = localStorage.getItem("token");

  // Check if a token exists, otherwise redirect to login
  if (!token) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const ProtectedRoute = ({ allowedRoles, component: Component, ...rest }) => {
  const { userInfo } = useUserInfo();

  return (
    <Route
      {...rest}
      render={(props) => {
        // Check if the user has the allowed role, without other conditions
        if (userInfo && allowedRoles.includes(userInfo.role)) {
          return <Component {...props} />;
        }

        // Redirect to "not-authorized" if role doesn't match
        return <Navigate to="/not-authorized" />;
      }}
    />
  );
};

export { AuthProtected, ProtectedRoute };
