import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";
import Cookies from "js-cookie";

const initialState = {
  loading: false,
  error: "",
  updated_mods: [],
  users: [],
  tasks: [],
  userCount: 0,
  taskCount: 0,
};

export const createModerator = createAsyncThunk(
  "moderator/signup",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("moderator/api/signup", "POST", {
        body: JSON.stringify(data),
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateModeratorProfile = createAsyncThunk(
  "moderator/update-pro",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `moderator/api/update-pro/${data._id}/${
          import.meta.env.VITE_PROFILE_UPDATE
        }`,
        "PUT",
        {
          body: JSON.stringify(data),
          headers: {
            Authorization: data.token,
          },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "moderator/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("moderator/api/get-all-user-profile", "GET", {
        headers: { Authorization: Cookies.get("token") },
      });

      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllTasks = createAsyncThunk(
  "moderator/get-all-tasks",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("task/api/get-all-tasks", "GET", {
        headers: { Authorization: Cookies.get("token") },
      });

      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const moderatorSlice = createSlice({
  name: "moderator",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createModerator.pending, (state) => {
        state.loading = true;
      })
      .addCase(createModerator.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // i don't need to store the user...
          state.error = "";
        }
      })
      .addCase(createModerator.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(updateModeratorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateModeratorProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          state.updated_moderator = action?.payload?.data;
          state.user = action?.payload?.data;
        }
      })
      .addCase(updateModeratorProfile.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          // console.log(action.payload);
          state.users = action?.payload?.data;
          state.userCount = action?.payload?.data?.length;
          state.error = "";
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          // console.log(action.payload);
          state.taskCount = action?.payload?.data?.length;
          state.error = "";
        }
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      });
  },
});

export default moderatorSlice;
