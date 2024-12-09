import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMods,
  getAllTasks,
  getAllUsers,
} from "../../redux/slices/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Fetching the stats from the Redux store
  const { userCount, moderatorCount, totalTaskCount } = useSelector(
    (state) => state.admin
  );

  // Dispatching the action to fetch data
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllMods());
    dispatch(getAllTasks());
  }, [dispatch]);

  return (
    <div className="bg-[#1E1B29] p-6">
      {/* Dashboard Header */}
      <h1 className="text-[#E6E1FF] text-3xl font-semibold mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Users Count Card */}
        <div className="bg-[#2A2739] p-6 rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
          <h2 className="text-[#E6E1FF] text-xl font-medium mb-2">
            Total Users
          </h2>
          <p className="text-[#E6E1FF] text-4xl font-bold">{userCount}</p>
        </div>

        {/* Moderators Count Card */}
        <div className="bg-[#2A2739] p-6 rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
          <h2 className="text-[#E6E1FF] text-xl font-medium mb-2">
            Total Moderators
          </h2>
          <p className="text-[#E6E1FF] text-4xl font-bold">{moderatorCount}</p>
        </div>

        {/* Total Tasks Count Card */}
        <div className="bg-[#2A2739] p-6 rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
          <h2 className="text-[#E6E1FF] text-xl font-medium mb-2">
            Total Tasks
          </h2>
          <p className="text-[#E6E1FF] text-4xl font-bold">{totalTaskCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
