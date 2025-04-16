import mongoose from "mongoose";
const { Schema } = mongoose;

const SectionImageSchema = new Schema({
  imageURL: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  public_id: {
    type: String,
  },
});

export const SectionImage = mongoose.model("SectionImage", SectionImageSchema);
