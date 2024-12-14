import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

import { verifyToken } from "./redux/slices/authSlice";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ModeratorManagement from "./pages/Admin/ModeratorManagement";
import RoleManagement from "./pages/Admin/RoleManagement";
import AdminLayout from "./pages/Admin/AdminLayout";
import UserLayout from "./pages/User/UserLayout";
import ModeratorLayout from "./pages/Moderator/ModeratorLayout";
import UserDashboard from "./pages/User/UserDashboard";
import UserProfile from "./pages/User/UserProfile";
import AdminTask from "./pages/Admin/AdminTask";
import UserTask from "./pages/User/UserTask";
import ModeratorTask from "./pages/Moderator/ModeratorTask";
import ModeratorProfile from "./pages/Moderator/ModeratorProfile";
import ModDashboard from "./pages/Moderator/ModDashboard";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role, loading } = useSelector((state) => state.auth);

  // Verify the token on app load if a token exists in cookies
  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isLoggedIn) {
      dispatch(verifyToken());
    }
  }, [dispatch, isLoggedIn]);

  // Determine the home route based on the user's role
  const getHomeRoute = (role) => {
    switch (role) {
      case "admin":
        return "/home-admin";
      case "moderator":
        return "/home-moderator";
      case "user":
        return "/home-user";
      default:
        return "/login";
    }
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or skeleton screen
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to={getHomeRoute(role)} /> : <Signin />}
      />
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to={getHomeRoute(role)} /> : <Signup />}
      />

      {/* Protected Routes */}
      {/* admin routes */}
      <Route
        path="/home-admin"
        element={
          isLoggedIn && role === "admin" ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="tasks" element={<AdminTask />} />
        <Route path="admin-control-users" element={<UserManagement />} />
        <Route
          path="admin-control-moderators"
          element={<ModeratorManagement />}
        />
        <Route path="admin-control-roles" element={<RoleManagement />} />
      </Route>

      {/* user routes */}
      <Route
        path="/home-user"
        element={
          isLoggedIn && role === "user" ? (
            <UserLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="user-dashboard" element={<UserDashboard />} />
        <Route path="tasks" element={<UserTask />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* moderator routes */}
      <Route
        path="/home-moderator"
        element={
          isLoggedIn && role === "moderator" ? (
            <ModeratorLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="tasks" element={<ModeratorTask />} />
        <Route path="profile" element={<ModeratorProfile />} />
        <Route path="moderator-dashboard" element={<ModDashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
