import { Router } from "express";
import { activeCheck, createPost, delete_comment_user, deletePost, increment_likes } from "../controllers/post.controller.js";
import multer from "multer";
import { getAllPosts, get_comments_by_post } from "../controllers/post.controller.js";
import { commentPost } from "../controllers/user.controller.js";



const router = Router();

router.route('/').get(activeCheck);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const upload = multer({ storage: storage });

router.route("/post").post(upload.single("media"),createPost)
router.route("/posts").get(getAllPosts)
// router.route("/posts").get(getAllPosts)
router.route("/delete_post").delete(deletePost)
router.route("/comment").post(commentPost)
router.route("/get_comments").get(get_comments_by_post)
router.route("/delete_comment").delete(delete_comment_user)
router.route("/increment_post_likes").post(increment_likes)




export default router;