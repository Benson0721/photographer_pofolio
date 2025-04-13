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

router.route("/images/:folder1").get(handleGetImages);

router
  .route("/images/:folder1/:folder2")
  .get(handleGetImages)
  .put(updateImage)
  .post(addImage)
  .delete(deleteImage);

export { router };
