import axios from "axios";
const baseURL = window.location.origin;

export const getDisplayImages = async (folderPath, topicID) => {
  const response = await axios.get(`${baseURL}/api/display/${folderPath}`, {
    params: { topicID },
  });
  if (response.status === 200) {
    return response.data.displayImages;
  }
  return { error: "Failed to fetch images" };
};

export const addDisplayImage = async (folderPath, formData) => {
  const response = await axios.post(
    `${baseURL}/api/display/${folderPath}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const deleteDisplayImage = async (folderPath, publicId, id) => {
  const response = await axios.delete(`${baseURL}/api/display/${folderPath}`, {
    params: { publicId, id },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
