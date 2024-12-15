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
import UserDetailsWithTasks from "./components/UserDetailsWithTasks";
import AdminProfile from "./pages/Admin/AdminProfile";
import ModDetailsWithTasks from "./components/ModDetailsWithTasks";
import PermissionManagement from "./pages/Admin/PermissionManagement";
import UserManagementMod from "./pages/Moderator/UserManagementMod";
import ProtectedRoute from "./components/protected-route/ProtectedRoute";
import Loading from "./components/Loading";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role, loading } = useSelector((state) => state.auth);

  // Verify token on app load
  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !isLoggedIn) {
      dispatch(verifyToken());
    }
  }, [dispatch, isLoggedIn]);

  // Handle loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to={`/home-${role}`} /> : <Signin />}
      />
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to={`/home-${role}`} /> : <Signup />}
      />

      {/* Protected Routes */}
      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/home-admin" element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="tasks" element={<AdminTask />} />
          <Route path="permissions" element={<PermissionManagement />} />
          <Route path="admin-control-users" element={<UserManagement />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route
            path="admin-control-users/:userId"
            element={<UserDetailsWithTasks />}
          />
          <Route
            path="admin-control-moderators"
            element={<ModeratorManagement />}
          />
          <Route
            path="admin-control-moderators/:modId"
            element={<ModDetailsWithTasks />}
          />
          <Route path="admin-control-roles" element={<RoleManagement />} />
        </Route>
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRole="user" />}>
        <Route path="/home-user" element={<UserLayout />}>
          <Route path="tasks" element={<UserTask />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      {/* Moderator Routes */}
      <Route element={<ProtectedRoute allowedRole="moderator" />}>
        <Route path="/home-moderator" element={<ModeratorLayout />}>
          <Route path="tasks" element={<ModeratorTask />} />
          <Route path="profile" element={<ModeratorProfile />} />
          <Route path="moderator-dashboard" element={<ModDashboard />} />
          <Route
            path="moderator-control-users"
            element={<UserManagementMod />}
          />
          <Route
            path="moderator-control-users/:userId"
            element={<UserDetailsWithTasks />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
