import { SectionImage } from "../models/SectionImageSchema.js";
import { updateImage } from "./cloudinaryApi/ImgApi.js";

export const getSectionImages = async (req, res) => {
  try {
    const SectionImages = await SectionImage.find({});
    res.json({ SectionImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSectionImage = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("後端");

    const { folder1, folder2 = "" } = req.params;
    const { title, id, publicID } = req.query;
    const filepath = req.file.path;
    console.log(filepath);
    const imageData = await updateImage(folder1, folder2, filepath, publicID);
    console.log(imageData);
    if (imageData.error) {
      return res.status(500).json({ message: imageData.error });
    }
    const image = SectionImage.findByIdAndUpdate(id, {
      imageURL: imageData.secure_url,
      public_id: imageData.public_id,
      title: title,
    });
    await image.save();
    res.status(200).json({ message: "新增圖片成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
