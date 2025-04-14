import express from "express";
import {
  getImages,
  addImage,
  updateImage,
  deleteImage,
} from "../controllers/cloudinaryAPI/ImgAPI.js";
const router = express.Router();

const handleGetImages = async (req, res) => {
  try {
    const { folder1, folder2 = "" } = req.params;
    const images = await getImages(folder1, folder2);
    res.json({ images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleUpdateImage = async (req, res) => {
  try {
    const { folder1, folder2 = "" } = req.params;
    const result = await updateImage(folder1, folder2);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.route("/images/:folder1").get(handleGetImages).put(handleUpdateImage);

router
  .route("/images/:folder1/:folder2")
  .get(handleGetImages)
  .put(handleUpdateImage)
  .post(addImage)
  .delete(deleteImage);

export { router };
