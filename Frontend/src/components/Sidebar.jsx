import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const currRole = useSelector((state) => state.auth.role);
  const selectAccordingToRole = {
    admin: [
      {
        name: "Dashboard",
        path: "admin-dashboard",
        icon: <FiHome />,
      },
      {
        name: "User Management",
        path: "admin-control-users",
        icon: <FiUsers />,
      },
      {
        name: "Role Management",
        path: "admin-control-roles",
        icon: <FiSettings />,
      },
    ],
    moderator: [
      {
        name: "Dashboard",
        path: "moderator-dashboard",
        icon: <FiHome />,
      },
    ],
    user: [
      {
        name: "Dashboard",
        path: "user-dashboard",
        icon: <FiHome />,
      },
    ],
  };

  const sidebarItems = selectAccordingToRole[currRole] || [];

  return (
    <div className="bg-gray-800 text-white w-64 h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <ul>
        {sidebarItems?.map((item) => (
          <li key={item.path} className="mb-4">
            <Link
              to={item.path}
              className="flex items-center hover:text-gray-400"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
