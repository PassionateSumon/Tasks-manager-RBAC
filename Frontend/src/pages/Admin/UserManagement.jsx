import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
  };

  const handleUpgrade = (userId, roleId) => {
    dispatch(upgradeUserToAny({ u_id: userId, r_id: roleId })).then((res) => {
      if (res.payload.code < 300) {
        dispatch(removeUser({ id: userId }));
      }
    });
    setActiveDropdown(null);
  };

  const handleViewDetails = (userId) => {
    navigate(`${userId}`);
  };

  return (
    <div className="p-6 bg-[#2A2739] rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
      <h1 className="text-2xl font-bold mb-6 text-[#E6E1FF]">
        User Management
      </h1>
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
                      <button
                        onClick={() => handleViewDetails(user._id)}
                        className="text-sm px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Delete
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(user._id)}
                          className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                        >
                          Change
                        </button>
                        {activeDropdown === user._id && (
                          <div className="absolute left-full top-0 ml-2 bg-[#1E1B29] text-[#E6E1FF] shadow-lg rounded-md w-48">
                            {roles?.map((role) => (
                              <button
                                key={role._id}
                                onClick={() =>
                                  handleUpgrade(user._id, role._id)
                                }
                                className={`block w-full text-left px-4 py-2 rounded-md hover:bg-[#2A2739] transition ${
                                  role.name === "admin"
                                    ? "text-green-400 hover:text-green-500"
                                    : "text-yellow-400 hover:text-yellow-500"
                                }`}
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
