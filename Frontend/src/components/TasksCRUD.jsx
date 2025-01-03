import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  createTask,
  deleteTask,
  fetchTasks,
  removeTask,
  updateTask,
} from "../redux/slices/taskSlice";

const TasksCRUD = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingStatus, setEditingStatus] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      dispatch(
        createTask({ title: taskTitle, description: taskDescription })
      ).then((res) => dispatch(addTask(res.payload?.data)));
      setTaskTitle("");
      setTaskDescription("");
    }
  };

  const handleUpdateTask = (id) => {
    if (
      editingTitle.trim() &&
      editingDescription.trim() &&
      editingStatus.trim()
    ) {
      dispatch(
        updateTask({
          id,
          title: editingTitle,
          description: editingDescription,
          status: editingStatus,
        })
      );
      setEditingTaskId(null);
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask({ id })).then((res) => {
      dispatch(removeTask(res.payload?.data?._id));
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#E6E1FF]">User Dashboard</h1>

      {/* Add Task Section */}
      <div className="bg-[#2A2739] p-4 rounded-md shadow-[0_2px_0px_rgba(245,66,152,0.3)] mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#E6E1FF]">Add Task</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="p-2 border border-[#ff007b] rounded-md focus:outline-none focus:ring focus:ring-[#F54298] bg-[#2A2739] text-[#E6E1FF]"
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="p-2 border border-[#ff007b] rounded-md focus:outline-none focus:ring focus:ring-[#F54298] bg-[#2A2739] text-[#E6E1FF]"
          ></textarea>
          <button
            onClick={handleCreateTask}
            className="bg-[#ff007b] text-white px-4 py-2 rounded-md hover:bg-[#9c1b57] transition"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-[#2A2739] p-4 rounded-md shadow-[0_2px_0px_rgba(245,66,152,0.3)]">
        <h2 className="text-xl font-semibold mb-4 text-[#E6E1FF]">Task List</h2>
        <ul className="space-y-4">
          {tasks?.map((task) => (
            <li
              key={task._id}
              className={`p-4 rounded-md shadow flex justify-between items-center 
              ${task.status === "complete" ? "border-2 border-green-500" : ""}
              ${task.status === "active" ? "border-2 border-blue-500" : ""}
              ${task.status === "inactive" ? "border-2 border-gray-500" : ""}
              ${editingTaskId === task._id ? "border-yellow-500" : ""}`}
            >
              {editingTaskId === task._id ? (
                <div className="flex-grow">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2 focus:outline-none focus:ring focus:ring-[#F54298] bg-[#2A2739] text-[#E6E1FF]"
                  />
                  <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-[#F54298] bg-[#2A2739] text-[#E6E1FF]"
                  ></textarea>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="p-2 border rounded-md w-full mt-2 focus:outline-none focus:ring focus:ring-[#F54298] bg-[#2A2739] text-[#E6E1FF]"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="complete">complete</option>
                  </select>
                  <button
                    onClick={() => handleUpdateTask(task._id)}
                    className="bg-green-500 text-[#E6E1FF] px-4 py-2 rounded-md mt-2 hover:bg-green-600 transition"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="bg-gray-400 text-[#E6E1FF] px-4 py-2 rounded-md mt-2 ml-2 hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  className={`flex flex-grow items-center justify-between ${
                    task.status === "inactive"
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-[#E6E1FF]">
                      {task.title}
                    </h3>
                    <p className="text-[#E6E1FF]">{task.description}</p>
                  </div>
                  <p className="text-[#E6E1FF] font-semibold">
                    Status:{" "}
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pl-4">
                {editingTaskId !== task._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditingTitle(task.title);
                        setEditingDescription(task.description);
                        setEditingStatus(task.status);
                      }}
                      className="bg-blue-500 text-[#E6E1FF] px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500 text-[#E6E1FF] px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksCRUD;
