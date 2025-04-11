import mongoose from "mongoose";
const { Schema } = mongoose;

const DisplayImageSchema = new Schema({
  topicID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TopicImage",
  },
  imageURL: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const DisplayImage = mongoose.model("DisplayImage", DisplayImageSchema);
