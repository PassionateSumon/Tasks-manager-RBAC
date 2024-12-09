import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout, user }) => {
  return (
    <div className="bg-[#2A2739] text-[#E6E1FF] shadow-[0_2px_0px_rgba(245,66,152,0.3)] border-b border-gray-700 px-4 py-2 flex justify-between items-center">
      {/* Logo/Title */}
      <h2 className="text-lg font-semibold text-gray-200"></h2>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Link to Profile */}
        <Link
          to=""
          className="text-gray-400 hover:text-gray-200 transition"
        >
          Profile
        </Link>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
