import { DisplayImage } from "../../models/DisplayImageSchema.js";

export const getDisplayImages = async (req, res) => {
  try {
    const { topicID } = req.params;
    const displayImages = await DisplayImage.find({ topicID });
    res.json({ displayImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDisplayImages = async (req, res) => {
  try {
    const { topicID } = req.params;
    const displayImages = await DisplayImage.find({ topicID });
    res.json({ displayImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDisplayImage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { displayID } = req.params;
    
    const deletedDisplayImage = await DisplayImage.findOneAndDelete({
      _id: displayID,
    });
    res.json({ deletedDisplayImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
