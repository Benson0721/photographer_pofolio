import axios from "axios";

const baseURL = window.location.origin;

export const getSectionImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/section/${folderPath}`);
  if (response.status === 200) {
    return response.data.sectionImages;
  }
  return { error: "Failed to fetch images" };
};

export const updateSectionImage = async (
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
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const adjustOffsetY = async (folderPath, id, offsetY) => {
  const response = await axios.patch(`${baseURL}/api/section/${folderPath}`, {
    offsetY,
    id,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateSectionName = async (id, title) => {
  const response = await axios.patch(`${baseURL}/api/section`, {
    id,
    title,
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
