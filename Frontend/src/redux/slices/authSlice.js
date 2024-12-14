import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";
import Cookies from "js-cookie";

const initialState = {
  loading: false,
  error: "",
  token: "",
  isLoggedIn: null,
  role: "",
  user: [],
};

const BASE_URL =
  import.meta.env.VITE_DEV_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PRODUCTION_SERVER;

export const loginUser = createAsyncThunk(
  "user/signin",
  async (data, { rejectWithValue }) => {
    try {
      // console.log(data)
      const apiRes = await useApi("users/api/signin", "POST", {
        body: JSON.stringify(data),
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const verifyToken = createAsyncThunk(
  "user/verify-token",
  async (_, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("validate-token", "GET", {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/update-pro",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/users/api/update-pro/${id}/${
          import.meta.env.VITE_PROFILE_UPDATE
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token"),
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = "";
      state.user = null;
      state.token = "";
      Cookies.remove("token");
      Cookies.remove("c_id");
    },
    updateUserPro: (state, action) => {
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          // console.log(action);
          state.isLoggedIn = true;
          const role = action?.payload?.role;
          const userAlldata = action?.payload?.data?._doc;
          const token = action?.payload?.data?.token;
          Cookies.set("token", token);
          Cookies.set("c_id", userAlldata?._id);
          state.role = role;
          state.token = token;
          state.user = userAlldata;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred.";
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.code === 401 || action?.payload?.code === 403) {
          state.isLoggedIn = false;
          // state.error = action?.payload?.message;
        } else {
          // console.log(action?.payload?.data[0]);
          // console.log(action?.payload?.data[0]?.roles[0].name);
          state.isLoggedIn = true;
          state.role = action?.payload?.data[0]?.roles[0].name || "";
          state.user = action?.payload?.data[0];
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred in token.";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          console.log(action.payload);
          state.user.name = action?.payload?.data?.name;
          state.user.email = action?.payload?.data?.email;
          state.error = "";
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      });
  },
});

export const { logout, updateUserPro } = authSlice.actions;
export default authSlice;
