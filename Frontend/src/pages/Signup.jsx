import React, { useState } from "react";
import FormWithYupSignup from "../components/Auth-Yup/FormWithYupSIgnup";
import { Link } from "react-router-dom";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState("User");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const roles = ["User", "Admin", "Moderator"];
  const otherRoles = roles?.filter((role) => role !== selectedRole);

  return (
    <div className="h-screen bg-[#1E1B29] flex justify-center items-center">
      <div>
        <div className="flex justify-between mb-7">
          {otherRoles?.map((role) => (
            <button
              key={role}
              className="border border-[#b70381] rounded-md py-2 px-4 text-[#E6E1FF] hover:bg-[#b70381] hover:text-white"
              onClick={() => handleRoleChange(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="text-center text-[#E6E1FF] mb-4">
          <span className="text-lg">Selected Role: </span>
          <span className="text-[#b70381] font-semibold">{selectedRole}</span>
        </div>

        <FormWithYupSignup role={selectedRole} />

        <div className="mt-8 text-center">
          <span className="text-[#E6E1FF]">Already signed up? </span>
          <Link
            to="/login"
            className="text-[#b70381] font-bold hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
