import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { careSlotApi } from "../features/api/careslotApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [careSlotApi.reducerPath]: careSlotApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(careSlotApi.middleware),
});