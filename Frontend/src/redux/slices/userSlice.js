import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";

const initialState = {
  loading: false,
  error: "",
  updated_user: null,
};

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

export const updateUserProfile = createAsyncThunk(
  "user/update-pro",
  async (data, { rejectWithValue }) => {
    try {
      const apiRes = await useApi(
        `users/api/update-pro/${data._id}/${
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
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code > 300) {
          state.error = action?.payload?.message;
        } else {
          state.updated_user = action?.payload?.data;
          state.error = "";
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload?.message || "An error occurred.";
      })
  },
});

export default userSlice;
