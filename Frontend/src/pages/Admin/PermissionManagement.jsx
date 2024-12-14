import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePermissions,
  getAllPermissionsByRole,
} from "../../redux/slices/adminSlice";

const allPermissions = [
  { _id: "6751356f08e21d116685dec6", task: "task - action:read" },
  { _id: "6751359708e21d116685dec7", task: "task - action:update" },
  { _id: "675135a208e21d116685dec8", task: "task - action:delete" },
  { _id: "675135af08e21d116685dec9", profile: "profile - action:read" },
  { _id: "675135c108e21d116685deca", profile: "profile - action:update" },
  { _id: "675135cc08e21d116685decb", profile: "profile - action:delete" },
  { _id: "675135d608e21d116685decc", role: "role - action:update" },
];

const PermissionManagement = () => {
  const dispatch = useDispatch();
  const rolesData = useSelector((state) => state.admin.allPermissions);

  const [moderatorPermissions, setModeratorPermissions] = useState([]);

  useEffect(() => {
    dispatch(getAllPermissionsByRole());
  }, [dispatch]);

  useEffect(() => {
    // Extract moderator permissions when API data is received
    const moderatorData = rolesData.find((role) => role.name === "moderator");
    if (moderatorData) {
      const initialPermissions = moderatorData.permissions.map((p) => p._id);
      setModeratorPermissions(initialPermissions);
    }
  }, [rolesData]);

  // Function to handle checkbox changes for the moderator section
  const handleCheckboxChange = (permissionId) => {
    setModeratorPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Submit handler for updating moderator permissions
  const handleUpdatePermissions = () => {
    const id = rolesData.find((role) => role.name === "moderator")?._id;
    dispatch(
      changePermissions({ roleId: id, permissions: moderatorPermissions })
    ).then((res) => console.log(res));
  };

  // Helper function to check if a permission is included
  const isPermissionChecked = (permissions, permissionId) =>
    permissions.some((p) => p._id === permissionId);

  return (
    <div className="bg-[#1E1B29] min-h-screen p-8 text-[#E6E1FF] cursor-pointer">
      <h1 className="text-2xl mb-6">Permission Management</h1>

      {/* User Section */}
      <div className="bg-[#2A2739] p-6 mb-4 shadow-[0_2px_0px_rgba(245,66,152,0.3)] rounded">
        <h2 className="text-xl mb-2">User</h2>
        <p className="text-gray-400 text-lg">
          User has no permissions and not to be updated.
        </p>
      </div>

      {/* Admin Section */}
      <div className="relative group bg-[#2A2739] p-6 mb-4 shadow-[0_2px_0px_rgba(245,66,152,0.3)] rounded">
        <h2 className="text-xl mb-2">Admin</h2>
        <fieldset>
          {allPermissions.map((perm) => (
            <label
              key={perm._id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isPermissionChecked(
                  rolesData.find((role) => role.name === "admin")
                    ?.permissions || [],
                  perm._id
                )}
                readOnly
              />
              <span>{Object.values(perm)[1]}</span>
            </label>
          ))}
        </fieldset>

        {/* Tooltip */}
        <div className="absolute hidden text-lg group-hover:block top-1/2 left-1/3 -translate-y-1/2 transform translate-x-4 bg-transparent shadow-[0_2px_0px_rgba(245,66,152,0.3)] text-white px-7 py-3 rounded">
          Admin permissions cannot be changed.
        </div>
      </div>

      {/* Moderator Section */}
      <div className="bg-[#2A2739] p-6 shadow-[0_2px_0px_rgba(245,66,152,0.3)] rounded">
        <h2 className="text-xl mb-4">Moderator</h2>
        {allPermissions.map((perm) => (
          <label
            key={perm._id}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={moderatorPermissions.includes(perm._id)}
              onChange={() => handleCheckboxChange(perm._id)}
            />
            <span>{Object.values(perm)[1]}</span>
          </label>
        ))}
        <button
          className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow-[0_2px_0px_rgba(245,66,152,0.3)]"
          onClick={handleUpdatePermissions}
        >
          Update Permissions
        </button>
      </div>
    </div>
  );
};

export default PermissionManagement;
