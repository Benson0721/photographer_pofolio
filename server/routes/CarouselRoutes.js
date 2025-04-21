import express from "express";
import {
  getCarouselImages,
  addCarouselImage,
  adjustCarouselOrder,
  deleteCarouselImage,
} from "../controllers/homeApi/CarouselApi.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router
  .route("/carousel/:folder1/:folder2")
  .get(getCarouselImages)
  .patch(adjustCarouselOrder)
  .post(upload.array("images"), addCarouselImage)
  .delete(deleteCarouselImage);

export { router };
