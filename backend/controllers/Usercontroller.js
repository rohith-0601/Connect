import { Profile } from "../models/ProfileModel.js";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { Connection } from "../models/ConnectionModel.js";
import { Post } from "../models/PostModels.js";
import { Comment } from "../models/CommentModel.js";

// ======================= PDF GENERATION ============================
const convertUserDataToPdf = async (userdata) => {
  const doc = new PDFDocument();
  const outputpath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputpath);

  doc.pipe(stream);
  doc.image(`uploads/${userdata.userId.Profile}`, { align: "center", width: 100 });
  doc.fontSize(14).text(`Name: ${userdata.userId.name}`);
  doc.fontSize(14).text(`Username: ${userdata.userId.username}`);
  doc.fontSize(14).text(`Email: ${userdata.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userdata.bio}`);
  doc.fontSize(14).text(`Current Position: ${userdata.currentPost}`);
  doc.fontSize(14).text("Past Work");
  userdata.pastWork.forEach((work) => {
    doc.fontSize(14).text(`Company: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });
  doc.end();
  return outputpath;
};

// ======================= AUTH & PROFILE ============================
export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password)
      return res.status(400).json({ message: "All fields Required" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const newuser = new User({ name, username, email, password: hashedPassword, token });
    await newuser.save();

    const profile = new Profile({ userId: newuser._id });
    await profile.save();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields Required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user Found" });

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.Profile = req.file.filename;
    await user.save();
    return res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { token, ...newuserdata } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email } = newuserdata;
    const existinguser = await User.findOne({ $or: [{ username }, { email }] });
    if (existinguser && String(existinguser._id) !== String(user._id))
      return res.status(400).json({ message: "User already exists" });

    Object.assign(user, newuserdata);
    await user.save();
    return res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || token === "undefined")
      return res.status(400).json({ message: "Token is missing or invalid" });

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userprofile = await Profile.findOne({ userId: user._id }).populate("userId", "name email username Profile");
    return res.json(userprofile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newprofiledata } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ userId: user._id });
    Object.assign(profile, newprofiledata);
    await profile.save();

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllprofiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "name username email Profile");
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Missing user_id" });

    const userprofile = await Profile.findOne({ userId: user_id }).populate("userId", "name email username Profile");
    if (!userprofile) return res.status(404).json({ message: `No profile found for user_id: ${user_id}` });

    const filepath = await convertUserDataToPdf(userprofile);
    return res.json({ message: filepath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================= CONNECTIONS ============================
export const ConnectionRequest = async (req, res) => {
  console.log("Body received:", req.body); // 👈

  const { token, connectionId } = req.body;

  if (!token || !connectionId) {
    return res.status(400).json({ error: "Token or connectionId missing" });
  }

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.equals(connectionId))
      return res.status(400).json({ message: "Cannot connect to yourself" });

    const existing = await Connection.findOne({
      $or: [
        { userId: user._id, connectionId },
        { userId: connectionId, connectionId: user._id }
      ]
    });

    if (existing) return res.status(400).json({ message: "Connection already exists" });

    const newConnection = new Connection({
      userId: user._id,
      connectionId,
      status: true // directly connected
    });

    await newConnection.save();
    return res.json({ message: "Connected", connection: newConnection });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const myConnections = async (req, res) => {
  try {
    const token = req.query.token; 
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await Connection.find({
      userId: user._id,
    }).populate("connectionId", "name username email Profile");

    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const WhatareMyConnections = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await Connection.find({ connectionId: user._id }).populate("userId", "name username email Profile");
    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================= COMMENTS ============================
export const commentPost = async (req, res) => {
  try {
    const { token, post_id, commentbody } = req.body;
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentbody,
    });

    await comment.save();
    return res.json({ comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ======================= OTHER ============================
export const getbyUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ userId: user._id }).populate("userId", "name username email Profile");
    return res.json({ userProfile: profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
