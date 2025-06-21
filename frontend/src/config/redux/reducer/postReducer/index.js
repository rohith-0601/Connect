import { createSlice } from "@reduxjs/toolkit";
import { getAllcomments, getAllposts } from "../../action/Postaction";
import { getAboutUser } from "../../action/Authaction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  isLoggedIn: false,
  isProfileFetched: false,
  user: null,
  connections: [],
  connectionRequest: [],
  message: "",
  comments: [],
  postId: "",
};

const postslice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetpostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllposts.pending, (state) => {
        (state.isLoading = true), (state.message = "Fetching all posts..");
      })
      .addCase(getAllposts.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.postFetched = true),
          (state.posts = action.payload.posts.reverse());
      })
      .addCase(getAllposts.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(getAllcomments.fulfilled, (state, action) => {
        state.comments = action.payload; 
        state.postId = action.meta.arg.post_id; 
      });
  },
});

export const { resetpostId } = postslice.actions;

export default postslice.reducer;
