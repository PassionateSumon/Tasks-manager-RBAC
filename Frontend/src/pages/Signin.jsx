import React from "react";
import FormWithYupLogin from "../components/Auth-Yup/FormWithYupLogin";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div className="h-screen bg-[#1E1B29] flex flex-col justify-center items-center">
      <div className="">
        <FormWithYupLogin />
      </div>
      <div className="mt-8 text-center">
        <span className="text-[#E6E1FF]">Already signed up? </span>
        <Link
          to="/signup"
          className="text-[#b70381] font-bold hover:underline"
        >
          Go to Signup
        </Link>
      </div>
    </div>
  );
};

export default Signin;
