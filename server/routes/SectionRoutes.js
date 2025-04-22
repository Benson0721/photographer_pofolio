import express from "express";
import {
  getSectionImages,
  updateSectionImage,
  adjustOffsetY,
  updateSectionName,
} from "../controllers/homeApi/SectionApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.route("/section").patch(checkAuth, updateSectionName);

router
  .route("/section/:folder1/:folder2")
  .get(getSectionImages)
  .put(checkAuth, upload.single("image"), updateSectionImage)
  .patch(checkAuth, adjustOffsetY);

export { router };
