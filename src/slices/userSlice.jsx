import { createSlice } from "@reduxjs/toolkit";

const storatedUser = localStorage.getItem("user");
const storatedToken = localStorage.getItem("token");

const initialState = {
  user: storatedUser ? JSON.parse(storatedUser) : null,
  token: storatedToken || null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;