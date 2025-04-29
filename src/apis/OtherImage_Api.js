import axios from "axios";

const baseURL = window.location.origin;

export const getImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/images/${folderPath}`);
  if (response.status === 200) {
    return response.data.images;
  }
  return { error: "Failed to fetch images" };
};

export const updateImage = async (folderPath, formData, publicID) => {
  const response = await axios.put(
    `${baseURL}/api/images/${folderPath}`,
    formData,
    {
      params: {
        publicID,
      },
    }
  );
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to fetch images" };
};
