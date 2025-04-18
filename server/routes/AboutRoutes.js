import express from "express";
import {
  getAboutImages,
  updateAboutImage,
  adjustOffsetY,
} from "../controllers/AboutApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router
  .route("/about/:folder1")
  .get(getAboutImages)
  .put(upload.single("image"), updateAboutImage)
  .patch(adjustOffsetY);
export { router };
