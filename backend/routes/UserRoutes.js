import { Router } from "express";
import {
  register,
  Login,
  updateProfile,
  getUserAndProfile,
  updateProfileData,
  uploadProfilePicture,
  getAllprofiles,
  downloadProfile,
  ConnectionRequest, // ✅ still used, now auto-connects
  myConnections,
  WhatareMyConnections,
  getbyUsername,
} from "../controllers/Usercontroller.js";
import multer from "multer";

const router = Router();

// Multer config for profile uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.route("/update_profile_pic").post(upload.single("Profile"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(Login);
router.route("/updateprofile").post(updateProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_profiles").get(getAllprofiles);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_request").post(ConnectionRequest);
router.route("/user/my_connections").get(myConnections);
router.route("/user/user_connection_request").get(WhatareMyConnections);
router.route("/user/getuser").get(getbyUsername);

// ❌ Removed:
// router.route("/user/accept_connection_request").post(AcceptRequest);
// router.route("/user/get_connectionrequest", getConnectionRequests);

export default router;
