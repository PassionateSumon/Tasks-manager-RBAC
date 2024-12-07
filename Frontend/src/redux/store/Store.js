import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";

export const Store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});
