import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate hook
import { logout } from "../../redux/slices/authSlice";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import RoleManagement from "./RoleManagement";

const HomeAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currState = useSelector((state) => state.auth);

  function handleClick() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleClick} />
        <main className="p-4 flex-1 overflow-y-auto">
          
        </main>
      </div>
    </div>
  );
};

export default HomeAdmin;
