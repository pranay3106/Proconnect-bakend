import mongoose from "mongoose";




const CommentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true
    },
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;