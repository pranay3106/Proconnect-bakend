import mongoose, { connect } from "mongoose";


const connectRequest = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    connectedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status_accepted: {
        type: Boolean,
        default: false
    },
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectRequest);
export default ConnectionRequest;