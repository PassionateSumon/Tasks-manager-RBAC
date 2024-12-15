import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// ProtectedRoute component
const ProtectedRoute = ({ allowedRole }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    const homeRoutes = {
      admin: "/home-admin",
      moderator: "/home-moderator",
      user: "/home-user",
    };
    return <Navigate to={homeRoutes[role] || "/login"} />;
  }

  return <Outlet />; // Render child routes
};

export default ProtectedRoute;
