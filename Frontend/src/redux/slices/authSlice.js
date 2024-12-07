import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default authSlice;
