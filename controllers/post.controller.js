import { Profile } from "../models/profile.model.js";
import User from "../models/user.model.js";
 import bcrypt from "bcrypt";
 import Post from "../models/post.model.js";
 import Comment from "../models/cooment.model.js";

 
 export const activeCheck = async(req,res)=>{
    return res.status(200).json({
        message: "Server is active"
    });
}

export  const createPost =  async (req, res) => {
    const {token} = req.body
    try {

        // Check if the token is valid
        const user = await User.findOne({   token: token });
        if (!user) {
            return res.status(401).json({
                message: "USER NOT FOUND"
            });
        }
        // Check if the user is activeCO
        const post = new Post({
            userId: user._id,
            body : req.body.body, // Assuming req.body contains the post data
            media: req.file != undefined ? req.file.filename : "", // Handle file upload if present
            fileType: req.file != undefined ? req.file.mimetype : "",
        })

        await post.save()

        return res.status(200).json({message:"post created"})
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getAllPosts = async (req,res)=>{
    try{
        const posts = await Post.find().populate("userId","name username email profilePicture" ).lean();
const filteredPosts = posts.filter(post => post.userId);
        return res.json({posts :filteredPosts})
    }
catch(err){
    return res.status(500).json({message:err.message})
}
}

export const deletePost = async(req,res)=>{
    const {token,post_id} = req.body

    try{

        const user = await User
                .findOne({token:token})
                .select("_id")
         if (!user) {
            return res.status(401).json({
                message: "USER NOT FOUND"
            });
        }

        const post = await Post.findOne({_id:post_id})
        if (!post) {
            return res.status(401).json({
                message: "POST NOT FOUND"
            });
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await Post.deleteOne({_id:post_id})
        return res.json({message:"Post deleted"})
    }
catch(err){
    return res.status(500).json({message:err.message})
}
    }

    
// export const get_comments_by_post = async(req,res)=>{
//     const {post_id,token}= req.query;

//     try{
//      const post = await Post.findOne({
//             _id:post_id
//         })

//           if (!post) {
//             return res.status(404).json({
//                 message: "POST NOT FOUND"
//             });
//         }

//         const comments  = await Comment
//         .find({postId:post_id})
//         .populate("userId", "username name ")


//         // const comments = await Comment.find({ postId: post_id });
//         return res.json( comments.reverse());
//         }catch(err){
//         return res.status(500).json({
//             message: err.message
//         });
    
//     }
// }

import mongoose from "mongoose";

export const get_comments_by_post = async (req, res) => {
  try {
    const { post_id } = req.query;

    if (!mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(post_id) });

    if (!post) {
      return res.status(404).json({ message: "POST NOT FOUND" });
    }

    const comments = await Comment.find({ postId: post_id });
    return res.status(200).json({ comments });

  } catch (err) {
    console.error("getComments error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


    export const delete_comment_user = async(req,res)=>{
        const{token,comment_id}=req.body
        try{

            const user = await User.findOne({token:token}).select("_id")
             if (!user) {
            return res.status(401).json({
                message: "USER NOT FOUND"
            });
        }
        const comment = await Comment.findOne({"_id":comment_id})

        if(!comment){
                return res.status(404).json({message:"comment not found"})

        }

          if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await Comment.deleteOne({"_id":comment_id})

        return res.json({message:"Comment deleted Successfully"})
        }catch(err){
    return res.status(500).json({message:err.message})
      }
    }

    export const increment_likes = async(req,res)=>{
        const {post_id} = req.body;
        try{
            const post = await Post.findOne({"_id":post_id})

            if(!post){
                return res.status(404).json({message:"Post not found"})
            }

            post.likes = post.likes+1;

            await post.save();
            
            return res.json({message:"likes ++"})
        
        }catch(err){
        return res.status(500).json({message:err.message})
      }
    }
