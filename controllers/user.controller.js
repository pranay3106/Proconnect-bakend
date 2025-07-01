import { Profile } from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import { connect } from "http2";
import ConnectionRequest from "../models/connects.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/cooment.model.js";


const convertUserProfileToPDF = async(userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream = fs.createWriteStream("/uploads" +outputPath);
    doc.pipe(stream);
    doc.image("uploads/" + userData.userId.profilePicture, {align: 'center', width: 100, height: 100});
    doc.fontSize(14).text(`Username: ${userData.userId.username}`, {align: 'left'});
    doc.fontSize(14).text(`Email: ${userData.userId.email}`, {align: 'left'});
    doc.fontSize(14).text(`Name: ${userData.userId.name}`, {align: 'left'});
    doc.fontSize(14).text(`Bio: ${userData.bio}`, {align: 'left'});
    doc.fontSize(14).text(`Location: ${userData.location}`, {align: 'left'});
    doc.fontSize(14).text(`bio: ${userData.bio}`, {align: 'left'});
    doc.fontSize(14).text(`bio: ${userData.currentPosition}`, {align: 'left'});
    doc.fontSize(14).text("Past Works");
    userData.pastWork.forEach((work,index) => {
        doc.fontSize(12).text(`Company: ${work.company}`, {align: 'left'});
        doc.fontSize(12).text(`Position: ${work.position}`, {align: 'left'});
        doc.fontSize(12).text(`Duration: ${work.years}`, {align: 'left'});
    });

    doc.end();

    return outputPath
}

export const register = async(req,res)=>{

    try{
    const {username, email, password,name} = req.body;
    if(!username || !email || !password || !name){
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const user = await User.findOne({
        email
    });

  if(user){
        return res.status(400).json({
            message: "User already exists"
        });

    }
const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name
    }); 
    await newUser.save();
    const profile = new Profile({
        userId: newUser._id,
    });

    await profile.save();
    
 const token = crypto.randomBytes(32).toString('hex');
        await User.updateOne({ _id: newUser._id }, { token });

        // Return user and token
        return res.json({
            message: "User created",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name
            },
            token
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const user = await User.findOne({
            email
        });
        if(!user){
            return res.status(404).json({
                message: "User does not exist"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const token = crypto.randomBytes(32).toString('hex');
        await User.updateOne(
            { _id: user._id },
            { token } 
        );
        return res.json({token:token});
    }catch(err){
        // return res.status(500).json({
        //     message: "Internal server error"
        // });
        console.log(err.message)
    }
}

export const uploadProfilePicture = async(req, res) => {
    const {token} = req.body;
    try{
        const user = await User.findOne({
            token:token
        });
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.profilePicture = req.file.filename;    
        await user.save();

        return res.json({
            message: "Profile picture uploaded successfully"
        });
    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const updateUserProfile = async(req, res) => {
    try{
        const {token,...newuserData} = req.body;
        const user = await User.findOne({
            token:token
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
    
        const {username, email} = newuserData;
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({
                message: "User email already exists"
            });
        }
    }

    Object.assign(user, newuserData);
        await user.save();

        return res.json({
            message: "User profile updated successfully"
        });

     
    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const getUserAndProfile = async(req, res) => {
    try{
        const {token} = req.query;
        const user = await User.findOne({
            token:token
        })
        // .populate('profileId');

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userProfile = await Profile.findOne({
            userId: user._id
        }).populate('userId', 'username email name profilePicture');

        console.log('Token:', token);
console.log('User:', user?._id);
console.log('Profile:', userProfile);

        return res.json(userProfile);
    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const updateProfleData = async(req, res) => {
    try{
        const {token, ...newProfileData} = req.body;
        const user = await User.findOne({
            token: token
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        const profile_to_update = await Profile.findOne({
            userId: user._id
        });

        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();

        return res.status(200).json({
        message: "Profile updated successfully",
        profile: profile_to_update})



    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getUserAllProfile = async(req, res) => {
    try{

        //till user can be removed
        const {token} = req.body;
        const user = await User.findOne({
            token: token
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const profiles = await Profile.find(
        //     {
        //     userId: user._id
        // }
    ).populate('userId', 'username email name profilePicture');

    console.log("profilesss",{profiles})

        return res.json({profiles});
    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const downloadProfile = async(req, res) => {
    const user_Id = req.query.id;
    const userrProfile = await Profile.findOne({  userId: user_Id })
    .populate('userId', 'username email name profilePicture');  

    let outputPath = await convertUserProfileToPDF(userrProfile);
    res.status(200).json({
        message: "Profile downloaded successfully",
        data: outputPath
    });
}



export const sendConnectionRequest = async(req, res) => {
    try{
        const {token, receiverId} = req.body;
        const user = await User.findOne({
            token: token
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const connectionUser = await User.findOne({
            _id: receiverId
        });

        if(!connectionUser){
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionUserId: connectionUser._id
        });

        if(existingRequest){
        return res.json({
            message: "Connection request sent successfully"
        });
    }
    const request = new ConnectionRequest({
        userId: user._id,
        connectedUserId: connectionUser._id
    });
    await request.save();

    return res.json({
        message: "Connection request sent successfully"
    });

}catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getMyConnectionsRequests = async(req, res) => {
    const {token} = req.body;
    try{
        const user = await User.findOne({
            token: token
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const requests = await ConnectionRequest.find({
            userId: user._id
        }).populate('connectedUserId', 'username email name profilePicture');

        return res.json({requests})
    }
    catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const whatAreMyConnections = async(req, res) => {
    const {token} = req.query;
    try{
        const user = await User.findOne({
            token: token
        }); 
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        const connections = await ConnectionRequest.find({
            connectedUserId: user._id,

        }).populate('connectedUserId', 'username email name profilePicture');
    return res.json({connections})
    }
    catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
export const acceptConnectionRequest = async(req,res)=>{
    const {token,requestId,action_type}=req.body;


    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({"message":"user not found"})

        }
        const connection = await ConnectionRequest.findOne({
            _id: requestId,

        })

        if(action_type === "accept"){
            connection.status_accepted = true;
        }else{
        connection.status_accepted = false;

        }

        await connection.save()
        return res.json({"message":"req updated"})
    }catch(err){
             return res.json(err.message)

    }
}




export const commentPost = async(req,res)=>{
    const {token,post_id,commentBody}= req.body;

    try{
        const user = await User.findOne({token:token}).select("_id")
         if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        const post = await Post.findOne({
            _id:post_id
        })

          if (!post) {
            return res.status(401).json({
                message: "POST NOT FOUND"
            });
        }

        const comment = new Comment({
            userId:user._id,
            post_id:post._id,
            body:commentBody
        })

        await comment.save()
        return res.json({message:"Comment created"})
    }catch(err){
        return res.status(500).json({
            message: err.message
        });
    
    }
}


export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
    const {username} = req.query
    try{
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userProfile = await Profile.findOne({ userId: user._id })
        .populate("userId","name username email profilePicture");
        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json({"profile":userProfile });



    }catch(err){
        res.status(500).json({message:err.message})
    }
}


export const updateProfilePicture = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ userId: user._id });
    profile.profilePicture = req.file.filename;

    await profile.save();

    return res.json({ message: "Profile picture updated" });
  } catch (err) {
    console.error("Profile picture update error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
