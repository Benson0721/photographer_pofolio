import express from "express";
import {
  getDisplayImages,
  addDisplayImages,
  deleteDisplayImage,
} from "../controllers/portfolioApi/display-api.js";
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
  .route("/display/:folder1/:folder2")
  .get(getDisplayImages)
  .post(checkAuth, upload.array("images"), addDisplayImages)
  .delete(checkAuth, deleteDisplayImage);

export { router };
