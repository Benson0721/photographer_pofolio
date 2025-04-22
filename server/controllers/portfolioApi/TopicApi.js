import { TopicImage } from "../../models/TopicImageSchema.js";
import { addImages } from "../cloudinaryApi/ImgApi.js";

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
    const { category } = req.query;
    if (category) {
      const topicImages = await TopicImage.find({ category: category });
      if (!topicImages) {
        return res.status(404).json({ message: "No images found" });
      }
      res.json({ topicImages });
      return;
    }
    const topicImages = await TopicImage.find({});
    if (!topicImages) {
      return res.status(404).json({ message: "No images found" });
    }
    res.json({ topicImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTopicImage = async (req, res) => {
  try {
    const { category, topic, notes } = req.query;
    console.log("後端");
    console.log(req.body);
    console.log(category, topic, notes);
    const { folder1 } = req.params;
    const filepath = req.file.path;

    const imageData = await addImages(folder1, category, filepath);
    console.log(imageData);
    if (imageData.error) {
      return res.status(500).json({ message: imageData.error });
    }
    const newUrl = imageData.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_1440/"
    );
    const newTopicImage = new TopicImage({
      category,
      topic,
      notes,
      imageURL: newUrl,
    });
    await newTopicImage.save();
    res.json({ newTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTopicImage = async (req, res) => {
  try {
    const { category, topic, notes, thumbnail, publicID, id } = req.body;
    const { folder1, folder2 = "" } = req.params;

    const filepath = req.file.path;
    console.log(filepath);
    const filterPublicID = publicID.replace(
      `Pai/views/portfolio/${category}/`,
      ""
    );
    console.log(filterPublicID);
    const imageData = await updateImage(
      folder1,
      folder2,
      filepath,
      filterPublicID
    );
    const newUrl = imageData.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_1440/"
    );
    if (imageData.error) {
      return res.status(500).json({ message: imageData.error });
    }
    const newImage = await TopicImage.findByIdAndUpdate(
      id,
      {
        category,
        topic,
        notes,
        thumbnail,
        imageURL: newUrl,
      },
      { new: true }
    );
    res.status(200).json({ message: "上傳圖片成功!", newImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTopicInfo = async (req, res) => {
  try {
    const { category, topic, notes, thumbnail, id } = req.body;
    const updatedTopicImage = await TopicImage.findByIdAndUpdate(
      id,
      {
        category,
        topic,
        notes,
        thumbnail,
      },
      { new: true }
    );
    res.json({ updatedTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTopicImage = async (req, res) => {
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
