import express from "express";
import {
  getAboutImages,
  updateAboutImage,
  adjustOffsetY,
} from "../controllers/aboutApi/about-api.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router
  .route("/about/:folder1")
  .get(getAboutImages)
  .put(checkAuth, upload.single("image"), updateAboutImage)
  .patch(checkAuth, adjustOffsetY);
export { router };
