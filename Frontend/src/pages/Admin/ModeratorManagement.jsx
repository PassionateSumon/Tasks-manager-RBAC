import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMod,
  deleteUser,
  getAllMods,
  getAllRoles,
  removeMod,
  upgradeUserToAny,
} from "../../redux/slices/adminSlice";

const ModeratorManagement = () => {
  const dispatch = useDispatch();
  const moderators = useSelector((state) => state.admin.moderators); // Moderators from Redux store
  const roles = useSelector((state) => state.admin.roles); // Roles from Redux store
  const [activeDropdown, setActiveDropdown] = useState(null); // State to track dropdown visibility

  // Fetch moderators and roles on component mount
  useEffect(() => {
    dispatch(getAllMods());
    dispatch(getAllRoles());
  }, [dispatch]);

  // Toggle dropdown visibility
  const toggleDropdown = (userId) => {
    setActiveDropdown((prev) => (prev === userId ? null : userId));
  };

  // Delete user action
  const handleDelete = (userId) => {
    dispatch(deleteMod(userId)).then((res) => {
      if (res.payload.code < 300) {
        dispatch(removeMod({ id: userId }));
      }
    });
  };

  // Upgrade user role action
  const handleUpgrade = (userId, roleId) => {
    dispatch(upgradeUserToAny({ u_id: userId, r_id: roleId })).then((res) => {
      if (res.payload.code < 300) {
        dispatch(removeMod({ id: userId }));
      }
    });
    setActiveDropdown(null); // Close dropdown after action
  };

  return (
    <div className="p-6 bg-[#2A2739] rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-[#E6E1FF]">
        Moderator Management
      </h1>

      {/* Moderators Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#E6E1FF]">
          <thead className="bg-[#1E1B29]">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Permissions</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moderators?.length > 0 ? (
              moderators.map((moderator) => (
                <tr
                  key={moderator._id}
                  className="bg-[#2A2739] hover:bg-[#1E1B29] transition"
                >
                  <td className="py-4 px-6">{moderator.name}</td>
                  <td className="py-4 px-6">{moderator.email}</td>
                  <td className="py-4 px-6">
                    <ul className="list-disc pl-5">
                      {moderator.permissions?.map((perm) => (
                        <li key={perm._id}>
                          {perm.task
                            ? `task-${perm.task}`
                            : perm.profile
                            ? `profile-${perm.profile}`
                            : `role-${perm.role}`}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(moderator._id)}
                        className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>

                      {/* Upgrade Button */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(moderator._id)}
                          className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        >
                          Change
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === moderator._id && (
                          <div className="absolute top-12 left-0 bg-[#1E1B29] text-[#E6E1FF] shadow-[0_2px_0px_rgba(245,66,152,0.3)] rounded-lg p-2 space-y-2 z-10">
                            {roles?.map((role) => (
                              <button
                                key={role._id}
                                onClick={() =>
                                  handleUpgrade(moderator._id, role._id)
                                }
                                className={`text-sm px-4 py-2 ${
                                  role.name === "admin"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-yellow-500 hover:bg-yellow-600"
                                } text-white rounded-lg w-full text-left`}
                              >
                                {role.name.charAt(0).toUpperCase() +
                                  role.name.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-[#E6E1FF] italic"
                >
                  No moderators found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModeratorManagement;
