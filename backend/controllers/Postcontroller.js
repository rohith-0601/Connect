import mongoose from "mongoose";
import { Comment } from "../models/CommentModel.js";
import { Post } from "../models/PostModels.js";
import { User } from "../models/UserModel.js";

export const activecheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const CreatePost = async (req, res) => {
  try {
    const { token, body } = req.body;

    if (!token || !body) {
      return res.status(400).json({ message: "Missing token or body" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = new Post({
      userId: user._id,
      body: body,
      media: req.file ? req.file.filename : "",
      filetype: req.file ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.status(200).json({ message: "post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const allPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email Profile"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    let { token, post_id } = req.body;

    const user = await User.findOne({ token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "U are unathorized" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.json({ message: "post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  const { post_id } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Remove post existence check (redundant since comments can exist without post)
    const comments = await Comment.find({
      postId: post_id, // Use string directly (no need for ObjectId conversion)
    })
      .populate("userId", "username name Profile")
      .sort({ createdAt: -1 });

    // Return only the comments array (frontend expects this)
    return res.json(comments); // ⚠️ Critical change
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const delete_comment = async (req, res) => {
  try {
    let { token, comment_id } = req.body;
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comment = await Comment.findOne({ comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() != user.userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  let { post_id } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    post.likes = post.likes + 1;

    await post.save();
    return res.json({ message: "likes increased" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
