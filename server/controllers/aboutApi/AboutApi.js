import { AboutImage } from "../../models/AboutImageSchema.js";
import { updateImage } from "../cloudinaryApi/ImgApi.js";

export const getAboutImages = async (req, res) => {
  try {
    const AboutImages = await AboutImage.find({});
    res.json({ AboutImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAboutImage = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { folder1 } = req.params;
    const { publicID } = req.query;
    const filepath = req.file.path;
    const filterPublicID = publicID.replace("Pai/views/about/", "");
    const imageData = await updateImage(folder1, filepath, filterPublicID);
    const newUrl = imageData.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_1440/"
    );
    if (imageData.error) {
      return res.status(500).json({ message: imageData.error });
    }
    await AboutImage.findByIdAndUpdate(
      id,
      {
        imageURL: newUrl,
        public_id: imageData.public_id,
      },
      { new: true }
    );
    res.status(200).json({ message: "上傳圖片成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const adjustOffsetY = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, offsetY } = req.body;

    await AboutImage.findByIdAndUpdate(
      id,
      {
        offsetY: offsetY,
      },
      { new: true }
    );
    res.status(200).json({ message: "調整成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
