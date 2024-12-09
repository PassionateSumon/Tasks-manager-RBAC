import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useApi } from "../../utils/apiWrapper";

const initialState = {
  loading: false,
  error: "",
  updated_admin: null,
};

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

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
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
      state.loading = true;
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
      state.loading = true;
      state.error = action.payload?.message || "An error occurred.";
    });
  }
});
export default adminSlice;