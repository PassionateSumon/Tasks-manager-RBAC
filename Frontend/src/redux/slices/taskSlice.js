import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { useApi } from "../../utils/apiWrapper";

const initialState = {
  loading: false,
  error: "",
  tasks: [],
};

const BASE_URL =
  import.meta.env.VITE_DEV_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PRODUCTION_SERVER;

export const createTask = createAsyncThunk(
  "user/create-task",
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/task/api/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Cookies.get("token"),
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchTasks = createAsyncThunk(
  "user/fetch-tasks",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `task/api/get-tasks-by-actual-person/${Cookies.get("c_id")}/${
          import.meta.env.VITE_TASK_READ
        }`,
        "GET",
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateTask = createAsyncThunk(
  "user/update-task",
  async ({ id, title, description, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/task/api/update-task/${Cookies.get("c_id")}/${id}/${
          import.meta.env.VITE_TASK_UPDATE
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token"),
          },
          credentials: "include",
          body: JSON.stringify({ title, description, status }),
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteTask = createAsyncThunk(
  "user/delete-task",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/task/api/delete-task/${Cookies.get("c_id")}/${id}/${
          import.meta.env.VITE_TASK_DELETE
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: Cookies.get("token"),
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks = [...state.tasks, action.payload];
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks?.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // console.log(action.payload?.data);
          state.error = "";
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // console.log(action.payload);
          state.tasks = action.payload?.data;
          state.error = "";
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // console.log(action.payload);
          const tId = action.payload?.data?._id;
          const foundTask = state.tasks.findIndex((task) => task._id === tId);
          if (foundTask !== -1) {
            state.tasks[foundTask] = action.payload?.data;
          }

          state.error = "";
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      });
  },
});

export const { addTask, removeTask } = taskSlice.actions;
export default taskSlice;
