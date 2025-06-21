import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  loginUser,
  registerUser,
} from "../../action/Authaction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: false,
  isProfileFetched: false,
  message: "",
  connections: [],
  connectionrequests: [],
  istokenthere: false,
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    setTokenisThere: (state) => {
      state.istokenthere = true;
    },
    setTokenisNotThere: (state) => {
      state.istokenthere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "logging in..";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.message = "user logged in ";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "creating..";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.message = "registration successful ";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isProfileFetched = true;
        state.user = action.payload;
        state.connections = action.payload.connections;
        state.connectionrequests = action.payload.connectionRequest;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload;
      })

      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { setTokenisThere, setTokenisNotThere, reset, handleLoginUser } =
  authSlice.actions;

export default authSlice.reducer;
