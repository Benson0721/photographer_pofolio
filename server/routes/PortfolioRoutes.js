import express from "express";
import {
  getAllTopicImages,
  getTopicImages,
  addTopicImage,
  updateTopicImage,
  deleteTopicImage,
} from "../controllers/TopicApi.js";
import {
  getDisplayImages,
  deleteDisplayImage,
} from "../controllers/DisplayApi.js";

const router = express.Router();

router.route("/allTopic").get(getAllTopicImages);

router
  .route("/:category")
  .get(getTopicImages)
  .post(addTopicImage)
  .patch(updateTopicImage);

router
  .route("/:category/:topicID")
  .get(getDisplayImages)
  .delete(deleteTopicImage);

router.route("/:category/:topicID/:displayID").delete(deleteDisplayImage);

export { router };
