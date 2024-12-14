import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";
import { MdOutlineTaskAlt } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";

const Sidebar = () => {
  // Fetch the current role from Redux
  const currRole = useSelector((state) => state.auth.role);

  // Menu items for each role
  const selectAccordingToRole = {
    admin: [
      {
        name: "Dashboard",
        path: "admin-dashboard",
        icon: <FiHome className="text-xl" />,
      },
      {
        name: "User Management",
        path: "admin-control-users",
        icon: <FiUsers className="text-xl" />,
      },
      {
        name: "Moderator Management",
        path: "admin-control-moderators",
        icon: <FiUsers className="text-xl" />,
      },
      {
        name: "Permission Management",
        path: "permissions",
        icon: <FaCodePullRequest className="text-xl" />,
      },
      {
        name: "Tasks",
        path: "tasks",
        icon: <MdOutlineTaskAlt className="text-xl" />,
      },
    ],
    moderator: [
      {
        name: "Dashboard",
        path: "moderator-dashboard",
        icon: <FiHome className="text-xl" />,
      },
      {
        name: "User Management",
        path: "moderator-control-users",
        icon: <FiUsers className="text-xl" />,
      },
      {
        name: "Tasks",
        path: "tasks",
        icon: <MdOutlineTaskAlt className="text-xl" />,
      },
    ],
    user: [
      {
        name: "Dashboard",
        path: "user-dashboard",
        icon: <FiHome className="text-xl" />,
      },
      {
        name: "Tasks",
        path: "tasks",
        icon: <MdOutlineTaskAlt className="text-xl" />,
      },
    ],
  };

  // Dynamically select items based on role
  const sidebarItems = selectAccordingToRole[currRole] || [];

  return (
    <div className="bg-[#2A2739] text-[#E6E1FF] w-64 h-full p-4 flex flex-col shadow-[0_4px_15px_rgba(245,66,152,0.3)]">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        {currRole.toUpperCase()} PANEL
      </h1>

      {/* Sidebar Items */}
      <ul className="space-y-4">
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="flex items-center p-2 hover:bg-gray-700 rounded-md transition"
            >
              {item.icon}
              <span className="ml-3 text-sm font-medium">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
