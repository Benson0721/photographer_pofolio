import { v2 as cloudinary } from "cloudinary";

export const getImages = async (folder1, folder2 = "") => {
  try {
    console.log("後端");
    const res = await cloudinary.search
      .expression(`folder:Pai/views/${folder1}/${folder2}`)
      .sort_by("public_id", "asc")
      .max_results(30)
      .execute();
    return res.resources.map((img) => ({
      public_id: img.public_id,
      url: `https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v${img.version}/${img.public_id}`,
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
    console.log(folder1, folder2, filePath, publicId);
    const options = {
      folder: `Pai/views/${folder1}/${folder2}`,
      resource_type: "image",
      overwrite: true,
      public_id: publicId,
      invalidate: true, // 👈 告訴 Cloudinary 清掉舊圖快取
    };
    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    return { error: error.message };
  }
};

export const addImages = async (folder1, folder2 = "", filePath) => {
  try {
    console.log(folder1, folder2, filePath);
    const options = {
      folder: `Pai/views/${folder1}/${folder2}`,
      resource_type: "image",
    };
    if (filePath != Array) {
      const result = await cloudinary.uploader.upload(filePath, options);
      return result;
    }
    const uploadPromises = filePath.map(async (path) => {
      const result = await cloudinary.uploader.upload(path, options);
      return result;
    });
    const results = await Promise.all(uploadPromises);
    console.log(
      "圖片上傳成功：",
      results.map((r) => r.secure_url)
    );
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
    return result;
  } catch (error) {
    return { error: error.message };
  }
};
