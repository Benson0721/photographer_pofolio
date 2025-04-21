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

router.route("/topic").get(getAllTopicImages).patch(updateTopicInfo);

router
  .route("/topic/:folder1")
  .get(getTopicImages)
  .post(upload.single("image"), addTopicImage)
  .put(upload.single("image"), updateTopicImage)
  .delete(deleteTopicImage);

export { router };
