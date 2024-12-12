import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#1E1B29] text-[#E6E1FF] flex flex-col items-center justify-center">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-[#FE736D]">Task Manager - RBAC</span>
        </h1>
        <p className="text-lg text-gray-400">
          Simplify Role-Based Access Control with an intuitive interface.
        </p>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-3xl bg-[#2A2739] p-8 rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)] text-center">
        <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
        <p className="text-gray-400 mb-6">
          Manage users, roles, and permissions effortlessly with our system.
          Sign up or log in to access the features.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[#FE736D] px-6 py-2 rounded-md text-white font-medium hover:bg-[#E85B54] transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-[#1D7C53] px-6 py-2 rounded-md text-white font-medium hover:bg-[#166A42] transition"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-[#FE736D]">RBAC-UI</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
