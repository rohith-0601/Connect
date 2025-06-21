import { ClientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllposts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await ClientServer.get("/allposts");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ media, body }, thunkAPI) => {
    try {
      const formData = new FormData(); // ✅ Capital F
      const token = localStorage.getItem("token");

      formData.append("token", token); // if your backend expects this
      formData.append("body", body || "");
      formData.append("media", media); // media = selected file

      const response = await ClientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("posted");
      } else {
        return thunkAPI.rejectWithValue("post not posted");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ token, post_id }, thunkAPI) => {
    try {
      const response = await ClientServer.post("/delete", {
        token,
        post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

export const incrementLikes = createAsyncThunk(
  "posts/incrementLikes",
  async ({ post_id }, thunkAPI) => {
    try {
      const response = await ClientServer.post("/increament", {
        post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllcomments = createAsyncThunk(
  "posts/getAllcomments",
  async (PostData, thunkAPI) => {
    try {
      const response = await ClientServer.get("/get_comments", {
        params: { post_id: PostData.post_id },
      });
      return response.data; // Return just the comments array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "/posts/addComment",
  async (commentdata, thunkAPI) => {
    try {
      console.log(`post id ${commentdata.post_id}`)
      const response = await ClientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentdata.post_id,
        commentbody: commentdata.body, // ✅ key name matches backend
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

