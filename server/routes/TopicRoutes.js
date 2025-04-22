import express from "express";
import {
  getTopicImages,
  getAllTopicImages,
  addTopicImage,
  updateTopicImage,
  deleteTopicImage,
  updateTopicInfo,
} from "../controllers/portfolioApi/TopicApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.route("/topic").patch(checkAuth, updateTopicInfo);

router
  .route("/topic/:folder1")
  .get(getTopicImages)
  .post(checkAuth, upload.single("image"), addTopicImage)
  .put(checkAuth, upload.single("image"), updateTopicImage)
  .delete(checkAuth, deleteTopicImage);

export { router };
