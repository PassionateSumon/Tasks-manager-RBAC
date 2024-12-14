import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";
import Cookies from "js-cookie";

const initialState = {
  loading: false,
  error: "",
  updated_admin: [],
  users: [],
  moderators: [],
  roles: [],
  allPermissions: [],
  userCount: 0,
  moderatorCount: 0,
  totalTaskCount: 0,
};
const BASE_URL =
  import.meta.env.VITE_DEV_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PRODUCTION_SERVER;

export const registerAdmin = createAsyncThunk(
  "admin/signup",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("admin/api/signup", "POST", {
        body: JSON.stringify(data),
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateAdminProfile = createAsyncThunk(
  "admin/update-pro",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `admin/api/update-pro/${data._id}/${
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
export const getAllRoles = createAsyncThunk(
  "admin/get-all-roles",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("admin/api/get-all-roles", "GET", {
        headers: { Authorization: Cookies.get("token") },
      });

      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "admin/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("admin/api/get-all-user-profile", "GET", {
        headers: { Authorization: Cookies.get("token") },
      });

      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAllMods = createAsyncThunk(
  "admin/get-all-mods",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        "admin/api/get-all-moderators-profile",
        "GET",
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );

      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAllTasks = createAsyncThunk(
  "admin/get-all-tasks",
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
export const deleteUser = createAsyncThunk(
  "admin/delete-user",
  async ({ id }, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `users/api/delete-pro/${id}/${import.meta.env.VITE_PROFILE_DELETE}`,
        "DELETE",
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteMod = createAsyncThunk(
  "admin/delete-mod",
  async ({ id }, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `moderator/api/delete-pro/${id}/${import.meta.env.VITE_PROFILE_DELETE}`,
        "DELETE",
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const upgradeUserToAny = createAsyncThunk(
  "admin/upgrade-user-to-mod",
  async ({ u_id, r_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/api/update-person-role-by-admin/${u_id}/${
          import.meta.env.VITE_ROLE_UPDATE
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token"),
          },
          credentials: "include",
          body: JSON.stringify({ roleId: r_id }),
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getSingleUserDetails = createAsyncThunk(
  "users/get-single-user",
  async ({ id }, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `users/api/get-user-profile/${id}/${import.meta.env.VITE_PROFILE_READ}`,
        "GET",
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getSingleUserTasks = createAsyncThunk(
  "user/fetch-tasks",
  async ({ id }, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `task/api/get-tasks-by-actual-person/${id}/${
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
export const getSingleModDetails = createAsyncThunk(
  "moderator/get-single-user",
  async ({ id }, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `moderator/api/get-user-profile/${id}/${
          import.meta.env.VITE_PROFILE_READ
        }`,
        "GET",
        {
          headers: { Authorization: Cookies.get("token") },
        }
      );
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const getAllPermissionsByRole = createAsyncThunk(
  "admin/get-all-permissions",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("admin/api/get-all-users-permission", "GET", {
        headers: { Authorization: Cookies.get("token") },
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const changePermissions = createAsyncThunk(
  "admin/update-permissions",
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/api/change-permissions-moderator/${
          import.meta.env.VITE_ROLE_UPDATE
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token"),
          },
          credentials: "include",
          body: JSON.stringify({ roleId, permissions }),
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    removeUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload.id
      );
    },
    removeMod: (state, action) => {
      state.moderators = state.moderators.filter(
        (user) => user._id !== action.payload.id
      );
    },
    updateUserRoleInState: (state, action) => {
      const { id, role } = action.payload;
      const userIndex = state.users.findIndex((user) => user._id === id);
      if (userIndex !== -1) {
        state.users[userIndex].role = role;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // i don't need to store the user...
          state.error = "";
        }
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          state.updated_admin = action?.payload?.data;
          state.error = "";
        }
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(getAllMods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMods.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          // console.log(action.payload);
          state.moderators = action?.payload?.data;
          state.moderatorCount = action?.payload?.data?.length;
          state.error = "";
        }
      })
      .addCase(getAllMods.rejected, (state, action) => {
        state.loading = false;
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
          state.totalTaskCount = action?.payload?.data?.length;
          state.error = "";
        }
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          console.log(action.payload?.data);

          state.error = "";
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(upgradeUserToAny.pending, (state) => {
        state.loading = true;
      })
      .addCase(upgradeUserToAny.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          state.error = "";
        }
      })
      .addCase(upgradeUserToAny.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(getAllRoles.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action?.payload?.data;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || "An error occurred.";
      })
      .addCase(getAllPermissionsByRole.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllPermissionsByRole.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.code > 300) {
          state.error = action?.payload?.message;
        } else {
          // console.log(action.payload);
          state.allPermissions = action?.payload?.data;
          state.error = "";
        }
      })
      .addCase(getAllPermissionsByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || "An error occurred.";
      });
  },
});
export const { removeUser, removeMod, updateUserRoleInState } =
  adminSlice.actions;
export default adminSlice;
