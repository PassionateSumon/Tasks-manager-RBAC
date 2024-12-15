import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteMod,
  getSingleModDetails,
  getSingleUserTasks,
} from "../redux/slices/adminSlice";
import { deleteTask } from "../redux/slices/taskSlice";

const ModDetailsWithTasks = () => {
  const { modId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);

  useEffect(() => {
    dispatch(getSingleModDetails({ id: modId })).then((res) =>
      setUser(res.payload?.data?.[0])
    );
    dispatch(getSingleUserTasks({ id: modId })).then((res) =>
      setTasks(res.payload?.data)
    );
  }, [dispatch, modId]);

  const handleDeleteProfile = () => {
    dispatch(deleteMod({ id: modId })).then((res) => {
      if (res.payload?.code < 300) {
        navigate(-1); // Navigate back to the previous page
      }
    });
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask({ id: taskId })).then((res) => {
      if (res.payload?.code < 300) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      }
    });
  };

  return (
    <div className="p-6 bg-[#2A2739] rounded-lg shadow-[0_2px_0px_rgba(245,66,152,0.3)] relative">
      <button
        onClick={handleDeleteProfile}
        className="absolute top-6 right-6 text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        Delete Profile
      </button>
      <button
        onClick={() => navigate(-1)}
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
                  className="bg-[#1E1B29] p-4 rounded-lg mb-2 flex justify-between items-center cursor-pointer "
                  onMouseEnter={() => setHoveredTaskId(task._id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-[#E6E1FF]">
                      {task?.title}
                    </h3>
                    <p className="text-[#E6E1FF]">{task?.description}</p>
                    <p className="text-[#E6E1FF]">Status: {task?.status}</p>
                  </div>
                  {hoveredTaskId === task._id && (
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  )}
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

export default ModDetailsWithTasks;
