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

const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router
  .route("/carousel/:folder1/:folder2")
  .get(getCarouselImages)
  .patch(checkAuth, adjustCarouselOrder)
  .post(checkAuth, upload.array("images"), addCarouselImage)
  .delete(checkAuth, deleteCarouselImage);

export { router };
