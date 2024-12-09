import React from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slices/authSlice';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const ModeratorLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleClick() {
      dispatch(logout());
      navigate("/login");
    }
    return (
      <div className="flex h-screen bg-[#1E1B29]">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar onLogout={handleClick} />
          <main className="p-4 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
}

export default ModeratorLayout