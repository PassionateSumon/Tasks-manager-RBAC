import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";
import Cookies from "js-cookie";

const initialState = {
  loading: false,
  error: "",
  token: "",
  isLoggedIn: null,
  role: "",
  user: null,
};

export const loginUser = createAsyncThunk(
  "user/signin",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data)
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
      const apiRes = await useApi(
        "validate-token",
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
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice;
