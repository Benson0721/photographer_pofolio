import express from "express";
import {
  getSectionImages,
  updateSectionImage,
} from "../controllers/SectionApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router
  .route("/section/:folder1/:folder2")
  .get(getSectionImages)
  .patch(upload.single("image"), updateSectionImage);
export { router };
