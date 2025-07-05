import { Router } from "express";
import { login, register,uploadProfilePicture,updateUserProfile, getUserAndProfile, updateProfleData, getUserAllProfile,downloadProfile, acceptConnectionRequest, getMyConnectionsRequests, sendConnectionRequest, whatAreMyConnections, getUserProfileAndUserBasedOnUsername, updateProfilePicture} from "../controllers/user.controller.js";
import multer from "multer";
import { get } from "mongoose";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';  // make sure you create this file
import  path  from "path";


const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'proconnect/profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});



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

const upload =  multer({ storage: storage });



// router.route('/upload').post(upload.single('file'),uploadProfilePicture);
router.route("/update_profile_picture").post( upload.single("profile_picture"),updateProfilePicture );


router.route('/register').post(register);
router.route('/login').post(login)

router.route("/user_update").post(updateUserProfile)
router.route("/get_user_and_profile").get(getUserAndProfile)
router.route("/update_profile_data").post(updateProfleData);
router.route("/user/get_all_users").get(getUserAllProfile);
router.route("/user/download_resume").get(downloadProfile);

router.route("/user/send_connection_request").post(sendConnectionRequest) //done
router.route("/user/getConnectionRequests").get(getMyConnectionsRequests)
router.route("/user/user_connection_request").get(whatAreMyConnections)  // done 
router.route("/user/accept_connection_Request").post(acceptConnectionRequest)
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername)


// Get all users (route /user/get_all_users) done ...

// Get connections (probably /user/whatAreMyConnections or similar)

// Get connection requests (e.g. /user/getConnectionRequests or /user/user_connection_request) donee..



export default router;