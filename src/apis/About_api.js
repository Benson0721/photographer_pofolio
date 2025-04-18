import axios from "axios";

const baseURL = window.location.origin;

export const getAboutImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/about/${folderPath}`);
  console.log(response);
  if (response.status === 200) {
    return response.data.AboutImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateAboutImage = async (
  folderPath,
  formData,
  title,
  id,
  publicID
) => {
  const response = await axios.put(
    `${baseURL}/api/about/${folderPath}`,
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

export const adjustOffsetY = async (folderPath, id, offsetY) => {
  const response = await axios.patch(`${baseURL}/api/about/${folderPath}`, {
    offsetY,
    id,
  });
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to fetch images" };
};
