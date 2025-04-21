import { SectionImage } from "../../models/SectionImageSchema.js";
import { updateImage } from "../cloudinaryApi/ImgApi.js";

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
    const { title, id, publicID = "" } = req.query;

    const filepath = req.file.path;
    console.log(filepath);
    const filterPublicID = publicID.replace("Pai/views/home/sections/", "");
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
    const response = await SectionImage.findByIdAndUpdate(
      id,
      {
        imageURL: newUrl,
        public_id: imageData.public_id,
        title: title,
      },
      { new: true }
    );
    console.log(response);
    res.status(200).json({ message: "上傳圖片成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateSectionName = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("後端");
    const { title, id } = req.body;
    console.log(title, id);
    const response = await SectionImage.findByIdAndUpdate(
      id,
      {
        title: title,
      },
      { new: true }
    );
    console.log(response);
    res.status(200).json({ message: "更改Seciton名稱成功!" });
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
    console.log("後端");
    console.log(req);
    const { id, offsetY } = req.body;
    console.log(id, offsetY);

    const response = await SectionImage.findByIdAndUpdate(
      id,
      {
        offsetY: offsetY,
      },
      { new: true }
    );
    console.log(response);
    res.status(200).json({ message: "調整成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
