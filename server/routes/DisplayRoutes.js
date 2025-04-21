import express from "express";
import {
  getDisplayImages,
  addDisplayImages,
  deleteDisplayImage,
} from "../controllers/portfolioApi/DisplayApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router
  .route("/display/:folder1/:folder2")
  .get(getDisplayImages)
  .post(upload.array("images"), addDisplayImages)
  .delete(deleteDisplayImage);

export { router };
