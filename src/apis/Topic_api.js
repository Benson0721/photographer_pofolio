import axios from "axios";

const baseURL = window.location.origin;

export const getTopicImages = async (folderPath = "", category = "") => {
  const response = await axios.get(`${baseURL}/api/topic/${folderPath}`, {
    params: {
      category,
    },
  });
  if (response.status === 200) {
    return response.data.topicImages;
  }
  return { error: "Failed to fetch images" };
};

export const addTopicImage = async (folderPath, formData, info) => {
  const response = await axios.post(
    `${baseURL}/api/topic/${folderPath}`,
    formData,
    {
      params: {
        category: info.category,
        topic: info.topic,
        notes: info.notes,
      },
    }
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const updateTopicImage = async (folderPath, formData) => {
  const response = await axios.put(
    `${baseURL}/api/topic/${folderPath}`,
    formData
  );
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};

export const deleteTopicImage = async (folderPath, publicId, id) => {
  const response = await axios.delete(`${baseURL}/api/topic/${folderPath}`, {
    params: {
      publicId,
      id,
    },
  });
  if (response.status === 200) {
    return response.data.message;
  }
  return { error: response.data.error };
};
