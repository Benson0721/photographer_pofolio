import axios from "axios";

const baseURL = window.location.origin;

export const getImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/section/${folderPath}`);
  console.log(response);
  if (response.status === 200) {
    return response.data.SectionImages;
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
    `${baseURL}/api/section/${folderPath}`,
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
  console.log(folderPath, id, offsetY);
  const response = await axios.patch(`${baseURL}/api/section/${folderPath}`, {
    offsetY,
    id,
  });
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to fetch images" };
};
