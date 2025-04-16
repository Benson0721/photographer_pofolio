import axios from "axios";

const baseURL = window.location.origin;

export const getImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/carousel/${folderPath}`);
  if (response.status === 200) {
    return response.data.images;
  }
  return { error: "Failed to fetch images" };
};

export const updateImage = async (
  folderPath,
  formData,
  title,
  id,
  publicID
) => {
  const response = await axios.put(
    `${baseURL}/api/carousel/${folderPath}`,
    formData,
    {
      params: {
        title,
        id,
        publicID,
      },
    }
  );
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to fetch images" };
};
