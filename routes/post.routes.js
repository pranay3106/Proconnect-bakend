import { Router } from "express";
import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { 
  activeCheck, 
  createPost, 
  delete_comment_user, 
  deletePost, 
  increment_likes, 
  getAllPosts, 
  get_comments_by_post 
} from "../controllers/post.controller.js";

import { commentPost } from "../controllers/user.controller.js";

const router = Router();

// Setup multer to save files locally in 'uploads/' folder
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");  // Make sure this folder exists in your backend root
//   },
//   filename: function (req, file, cb) {
//     // Unique filename: timestamp + random + original extension
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'proconnect/media',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// Routes
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_user);
router.route("/increment_post_likes").post(increment_likes);

export default router;
