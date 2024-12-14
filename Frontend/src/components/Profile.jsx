import React, { useEffect, useState } from "react";
import { CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

const Profile = ({ onUpdateProfile }) => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(user?.name || "");
  const [editableEmail, setEditableEmail] = useState(user?.email || "");

  if (!user) {
    return (
      <div className="bg-[#2A2739] text-[#E6E1FF] shadow-[0_2px_0px_rgba(245,66,152,0.3)] p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center">PROFILE</h2>
        <p className="mt-6 text-gray-400 text-center">
          No information available.
        </p>
      </div>
    );
  }

  useEffect(() => {
    setEditableEmail(user.email);
    setEditableName(user.name);
  }, [user]);

  const handleSubmit = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        data: {
          name: editableName,
          email: editableEmail,
        },
        id: user._id,
      });
    }
    setIsEditing(false);
  };

  console.log(user);

  return (
    <div className="bg-[#2A2739] text-[#E6E1FF] shadow-[0_2px_0px_rgba(245,66,152,0.3)] p-8 rounded-lg max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">
          {user?.roles?.[0]?.name.toUpperCase()} PROFILE
        </h2>
        <p className="text-lg text-gray-400">
          Detailed information about the user
        </p>
      </div>
      <div className="space-y-4 bg-[#1E1E2E] p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Name</h3>
          {isEditing ? (
            <input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              className="bg-[#2A2739] text-gray-300 border border-gray-500 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-pink-500"
            />
          ) : (
            <p className="text-gray-300 font-medium">{user.name}</p>
          )}
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Email</h3>
          {isEditing ? (
            <input
              type="email"
              value={editableEmail}
              onChange={(e) => setEditableEmail(e.target.value)}
              className="bg-[#2A2739] text-gray-300 border border-gray-500 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-pink-500"
            />
          ) : (
            <p className="text-gray-300 font-medium">{user.email}</p>
          )}
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Username</h3>
          <p className="text-gray-300 font-medium">{user.username}</p>
        </div>
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Role</h3>
          <p className="text-gray-300 font-medium">
            {user.roles?.[0]?.name || "N/A"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Created At</h3>
          <p className="text-gray-300 font-medium">
            {new Date(user.createdAt).toLocaleDateString()} {" - "}
            {new Date(user.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="text-center mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition mr-4"
            >
              Submit
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
