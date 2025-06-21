import { Router } from "express";
import { activecheck, allPosts, CreatePost, delete_comment, deletePost, getComments, increment_likes } from "../controllers/Postcontroller.js";
import multer from "multer";
import { commentPost } from "../controllers/Usercontroller.js";


const router  = Router();


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage})

router.route("/").get(activecheck)
router.route("/post").post(upload.single("media"),CreatePost)
router.route("/allposts").get(allPosts)
router.route("/delete").post(deletePost)
router.route("/comment").post(commentPost)
router.route("/get_comments").get(getComments)
router.route("/delete_comment").post(delete_comment)
router.route("/increament").post(increment_likes)


export default router