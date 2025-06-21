import { ClientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await ClientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("token", response.data.token);
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✅ Register
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await ClientServer.post("/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("token", response.data.token);
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✅ Fetch own profile
export const getAboutUser = createAsyncThunk(
  "user/getAboutuser",
  async (user, thunkAPI) => {
    try {
      const response = await ClientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✅ Fetch all users (for explore/discovery)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await ClientServer.get("/user/get_all_profiles");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✅ Direct connect request (now auto-accepted)
// ✅ FIXED VERSION
export const sendConnectionRequest = createAsyncThunk(
  "auth/sendConnectionRequest",
  async ({ token, connectionId }, thunkAPI) => {
    try {
      const response = await ClientServer.post(
        "/user/send_request",
        { token, connectionId }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);



export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async ({ token }, thunkAPI) => {
    try {
      const [sent, received] = await Promise.all([
        ClientServer.get("/user/my_connections", { params: { token } }),
        ClientServer.get("/user/user_connection_request", { params: { token } }),
      ]);

      return [...sent.data, ...received.data]; // ✅ merge both
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// ❌ REMOVED: getMyconnectionRequests
// ❌ REMOVED: acceptConnection
