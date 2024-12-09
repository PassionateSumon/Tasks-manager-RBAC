import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, createTask, fetchTasks } from "../../redux/slices/userSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.user.tasks); // Fetch tasks from the Redux store
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
//   console.log(tasks);

  useEffect(() => {
    dispatch(fetchTasks()); // Fetch tasks on component mount
  }, [dispatch]);

  const handleCreateTask = () => {
    if (taskTitle.trim() && taskDescription.trim()) {
      dispatch(createTask({ title: taskTitle, description: taskDescription }))
      .then((res) => dispatch(addTask(res.payload.data)));
      setTaskTitle("");
      setTaskDescription("");
    }
  };

  const handleUpdateTask = (id) => {
    // if (editingTitle.trim() && editingDescription.trim()) {
    //   dispatch(
    //     updateTask({ id, title: editingTitle, description: editingDescription })
    //   );
    //   setEditingTaskId(null);
    // }
  };

  const handleDeleteTask = (id) => {
    // dispatch(deleteTask(id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1D7C53]">User Dashboard</h1>

      {/* Add Task Section */}
      <div className="bg-[#D1EDE1] p-4 rounded-md shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task Title"
            className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-[#1D7C53]"
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task Description"
            className="p-2 border rounded-md focus:outline-none focus:ring focus:ring-[#1D7C53]"
          ></textarea>
          <button
            onClick={handleCreateTask}
            className="bg-[#FE736D] text-white px-4 py-2 rounded-md hover:bg-[#E85B54] transition"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-[#D1EDE1] p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white p-4 rounded-md shadow flex justify-between items-center"
            >
              {editingTaskId === task.id ? (
                <div className="flex-grow">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="p-2 border rounded-md w-full mb-2 focus:outline-none focus:ring focus:ring-[#1D7C53]"
                  />
                  <textarea
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring focus:ring-[#1D7C53]"
                  ></textarea>
                  <button
                    onClick={() => handleUpdateTask(task.id)}
                    className="bg-[#1D7C53] text-white px-4 py-2 rounded-md mt-2 hover:bg-[#166A42] transition"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md mt-2 ml-2 hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditingTitle(task.title);
                    setEditingDescription(task.description);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
