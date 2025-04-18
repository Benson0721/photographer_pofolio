import { CarouselImage } from "../models/CarouselImageSchema.js";
import { addImages, deleteImages } from "./cloudinaryApi/ImgApi.js";

export const getCarouselImages = async (req, res) => {
  try {
    const carouselImages = await CarouselImage.find({});
    res.json({ carouselImages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adjustCarouselOrder = async (req, res) => {
  try {
    console.log(req.body);
    const newOrderArray = req.body;
    console.log(newOrderArray);

    const bulkOps = newOrderArray.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await CarouselImage.bulkWrite(bulkOps);
    res.status(200).json({ message: "更新順序成功" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCarouselImage = async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("後端");

    const { folder1, folder2 = "" } = req.params;
    const files = req.files;
    const paths = files.map((file) => file.path);
    console.log(paths);
    const imageDatas = await addImages(folder1, folder2, paths);
    console.log(imageDatas);
    if (imageDatas.error) {
      return res.status(500).json({ message: imageDatas.error });
    }
    imageDatas.map(async (data) => {
      const newUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1440/"
      );
      const image = new CarouselImage({
        imageURL: newUrl,
        public_id: data.public_id,
      });
      await image.save();
    });
    res.status(200).json({ message: "新增圖片成功!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCarouselImage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { publicId, id } = req.query;
    await deleteImages(publicId);
    await CarouselImage.findByIdAndDelete(id);
    res.status(200).json({ message: "刪除成功" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
