import { v2 as cloudinary } from "cloudinary";

export const getImages = async (folder1, folder2 = "") => {
  try {
    const res = await cloudinary.search
      .expression(`folder:Pai/views/${folder1}/${folder2}`)
      .sort_by("public_id", "asc")
      .max_results(30)
      .execute();
    console.log(res);
    return res.resources.map((img) => ({
      public_id: img.public_id,
      url: `https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/${img.public_id}`,
      title: img.display_name,
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateImage = async (req, res) => {
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

export const addImage = async (req, res) => {
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

export const deleteImage = async (req, res) => {
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
