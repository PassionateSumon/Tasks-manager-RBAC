import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import adminSlice from "../slices/adminSlice";
import moderatorSlice from "../slices/moderatorSlice";
import userSlice from "../slices/userSlice";

export const Store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    admin: adminSlice.reducer,
    moderator: moderatorSlice.reducer,
    user: userSlice.reducer,
  },
});
