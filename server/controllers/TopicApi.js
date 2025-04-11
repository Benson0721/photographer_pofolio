import { TopicImage } from "../models/TopicImageSchema.js";

export const getAllTopicImages = async (req, res) => {
  try {
    const topicImages = await TopicImage.find({});
    res.json({ topicImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTopicImages = async (req, res) => {
  try {
    const { category } = req.params;
    const topicImages = await TopicImage.find({ category });
    res.json({ topicImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addTopicImage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { category, topic, notes, thumbnail } = req.body;
    const newTopicImage = new TopicImage({
      category,
      topic,
      notes,
      thumbnail,
    });
    await newTopicImage.save();
    res.json({ newTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTopicImage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { category, topic, notes, thumbnail } = req.body;
    const updatedTopicImage = await TopicImage.findOneAndUpdate(
      { category, topic },
      { $set: { notes, thumbnail } },
      { new: true }
    );
    res.json({ updatedTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteTopicImage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { category, topic } = req.params;
    const deletedTopicImage = await TopicImage.findOneAndDelete({
      category,
      topic,
    });
    res.json({ deletedTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
