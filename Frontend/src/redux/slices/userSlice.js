import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";
import Cookies from "js-cookie";

const initialState = {
  loading: false,
  error: "",
  user: [],
};
const BASE_URL =
  import.meta.env.VITE_DEV_ENVIRONMENT === "true"
    ? import.meta.env.VITE_DEV_SERVER
    : import.meta.env.VITE_PRODUCTION_SERVER;

export const createUser = createAsyncThunk(
  "user/signup",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi("users/api/signup", "POST", {
        body: JSON.stringify(data),
      });
      return apiRes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.code > 300) {
          state.error = action?.message;
        } else {
          // i don't need to store the user...
          state.error = "";
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      });
  },
});

export const { updateUserPro } = userSlice.actions;
export default userSlice;
