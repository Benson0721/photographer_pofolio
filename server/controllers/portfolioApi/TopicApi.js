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
    const { folder2 } = req.params;
    const topicImages = await TopicImage.find({ category: folder2 });

    if (!topicImages) {
      return res.status(404).json({ message: "No images found" });
    }
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
    const { category, topic, notes } = req.query;
    console.log(req.query);
    console.log("後端");

    const { folder1 } = req.params;
    const files = req.files;
    const paths = files.map((file) => file.path);

    console.log(paths);
    const imageDatas = await addImages(folder1, category, paths);
    console.log(imageDatas);
    if (imageDatas.error) {
      return res.status(500).json({ message: imageDatas.error });
    }
    imageDatas.map(async (data) => {
      const newUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1440/"
      );
      const image = new CarouselImage({
        imageURL: newUrl,
        public_id: data.public_id,
      });
      await image.save();
    });
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
    const updatedTopicImage = await TopicImage.findByIdAndUpdate(
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
    res.json({ updatedTopicImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateTopicInfo = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
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
