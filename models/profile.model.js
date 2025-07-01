import mongoose from "mongoose";
const educationSchema = mongoose.Schema({
  school: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldStudy: {
    type: String,
    required: true
  },
});

const workSchema = mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
    },
    years: {
    type: String,
    }
});

const profileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  currentPosition: {
    type: String,
    default: ""
  },
  pastWork: {
    type: [workSchema],
    default: []
  },
  education: {
    type: [educationSchema],
    default: []
  },
});

const Profile = mongoose.model("Profile", profileSchema);
const Education = mongoose.model("Education", educationSchema); 
const Work = mongoose.model("Work", workSchema);
export { Profile, Education, Work };

