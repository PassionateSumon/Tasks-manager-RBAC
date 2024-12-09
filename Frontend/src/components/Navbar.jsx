import React from "react";

const Navbar = ({ onLogout, user }) => {
  return (
    <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, {user?.name || "Admin"}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
