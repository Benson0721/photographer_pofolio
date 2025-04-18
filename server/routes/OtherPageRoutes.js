import express from "express";
import {
  getImages,
  addImages,
  updateImage,
  deleteImages,
} from "../controllers/cloudinaryApi/ImgApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("後端");
    const { folder1, folder2 = "" } = req.params;
    const { publicID } = req.query;
    const filepath = req.file.path;
    const filterPublicID = publicID.replace(
      `Pai/views/${folder1}/${folder2}`,
      ""
    );
    console.log(filterPublicID);
    const result = await updateImage(
      folder1,
      folder2,
      filepath,
      filterPublicID
    );
    console.log(result);
    res.status(200).json({ message: "上傳圖片成功!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router
  .route("/images/:folder1")
  .get(handleGetImages)
  .put(upload.single("image"), handleUpdateImage);

router
  .route("/images/:folder1/:folder2")
  .get(handleGetImages)
  .put(upload.single("image"), handleUpdateImage)
  .post(upload.array("images"), addImages)
  .delete(deleteImages);

export { router };
