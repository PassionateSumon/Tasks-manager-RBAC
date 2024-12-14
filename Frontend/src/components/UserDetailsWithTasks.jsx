import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getSingleUserDetails,
  getSingleUserTasks,
} from "../redux/slices/adminSlice";

const UserDetailsWithTasks = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    dispatch(getSingleUserDetails({ id: userId })).then((res) =>
      setUser(res.payload?.data?.[0])
    );
    dispatch(getSingleUserTasks({ id: userId })).then((res) =>
      setTasks(res.payload?.data)
    );
  }, [dispatch, userId]);

  return (
    <div className="p-6 bg-[#2A2739] rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
      <button
        onClick={() => navigate(-1)} // needs to be implemented
        className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mb-4"
      >
        Back
      </button>
      {user ? (
        <div>
          <h1 className="text-2xl font-bold text-[#E6E1FF]">
            {user.name}'s Details
          </h1>
          <p className="text-[#E6E1FF]">Email: {user?.email}</p>
          <p className="text-[#E6E1FF]">Role: {user.roles?.[0]?.name}</p>
          <h2 className="text-xl font-bold mt-6 mb-4 text-[#E6E1FF]">Tasks</h2>
          <ul>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li
                  key={task?._id}
                  className="bg-[#1E1B29] p-4 rounded-lg mb-2"
                >
                  <h3 className="text-lg font-semibold text-[#E6E1FF]">
                    {task?.title}
                  </h3>
                  <p className="text-[#E6E1FF]">{task?.description}</p>
                  <p className="text-[#E6E1FF]">Status: {task?.status}</p>
                </li>
              ))
            ) : (
              <p className="text-[#E6E1FF] italic">No tasks found.</p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-[#E6E1FF] italic">Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetailsWithTasks;
