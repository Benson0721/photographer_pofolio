import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// 假設上傳到 Cloudinary 成功後：

export const getImages = async (folder1, folder2 = "") => {
  try {
    const res = await cloudinary.search
      .expression(`folder:Pai/views/${folder1}/${folder2}`)
      .sort_by("public_id", "asc")
      .max_results(30)
      .execute();
    return res.resources.map((img) => ({
      public_id: img.public_id,
      url: `https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/${img.public_id}`,
      title: img.display_name,
    }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateImage = async (
  folder1,
  folder2 = "",
  filePath,
  publicId
) => {
  try {
    const options = {
      folder: `Pai/views/${folder1}/${folder2}`,
      resource_type: "image",
      overwrite: true,
      public_id: publicId,
    };
    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

export const addImages = async (folder1, folder2 = "", filePath) => {
  try {
    const uploadPromises = filePath.map(async (path) => {
      //儲存批量更新，再透過promise.all同時跑多個任務

      const options = {
        folder: `Pai/views/${folder1}/${folder2}`,
        resource_type: "image",
      };
      const result = await cloudinary.uploader.upload(path, options);
      return result;
    });
    const results = await Promise.all(uploadPromises);
    console.log(
      "批量圖片上傳成功：",
      results.map((r) => r.secure_url)
    );
    await fs.unlink(file.path); // file.path 是 multer 存的本地路徑
    return results;
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteImages = async (publicId) => {
  console.log("刪除圖片", publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    console.log(result);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};
