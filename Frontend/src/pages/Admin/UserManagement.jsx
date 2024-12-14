import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getAllRoles,
  getAllUsers,
  removeUser,
  upgradeUserToAny,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const roles = useSelector((state) => state.admin.roles);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllRoles());
  }, [dispatch]);

  const toggleDropdown = (userId) => {
    setActiveDropdown((prev) => (prev === userId ? null : userId));
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId)).then((res) => {
      if (res.payload.code < 300) {
        dispatch(removeUser({ id: userId }));
      }
    });
    // console.log(`Delete user with ID: ${userId}`);
  };

  const handleUpgrade = (userId, roleId) => {
    dispatch(upgradeUserToAny({ u_id: userId, r_id: roleId })).then((res) => {
      if (res.payload.code < 300) {
        dispatch(removeUser({ id: userId }));
      }
    });
    // console.log(`Upgrade user with ID: ${userId} to Role ID: ${roleId}`);
    setActiveDropdown(null);
  };

  return (
    <div className="p-6 bg-[#2A2739] rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 text-[#E6E1FF]">
        User Management
      </h1>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#E6E1FF]">
          <thead className="bg-[#1E1B29]">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-[#2A2739] hover:bg-[#1E1B29] transition"
                >
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>

                      {/* Upgrade Button */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(user._id)}
                          className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        >
                          Change
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === user._id && (
                          <div className="absolute top-12 left-0 bg-[#1E1B29] text-[#E6E1FF] shadow-[0_2px_0px_rgba(245,66,152,0.3)] rounded-lg p-2 space-y-2 z-10">
                            {roles?.map((role) => (
                              <button
                                key={role._id}
                                onClick={() =>
                                  handleUpgrade(user._id, role._id)
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
                  colSpan="3"
                  className="text-center py-4 text-[#E6E1FF] italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
