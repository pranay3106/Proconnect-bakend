import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "default.jpg"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: ""
    },
});

const User =  mongoose.model("User", UserSchema);
// This code defines a Mongoose schema for a User model in a MongoDB database.
export default User;