import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("careslot_token") || null,
  user: JSON.parse(localStorage.getItem("careslot_user") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, email, role } = action.payload;
      state.token = token;
      state.user = { email, role };
      localStorage.setItem("careslot_token", token);
      localStorage.setItem("careslot_user", JSON.stringify({ email, role }));
    },
    logout: (state, action) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("careslot_token");
      localStorage.removeItem("careslot_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUserRole = (state) => state.auth.user?.role;
export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;
