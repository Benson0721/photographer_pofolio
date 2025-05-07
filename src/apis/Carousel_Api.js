import axios from "axios";
const baseURL = window.location.origin;

export const getCarouselImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/carousel/${folderPath}`);
  if (response.status === 200) {
    console.log(response.data.carouselImages);
    return response.data.carouselImages;
  }
  return { error: "Failed to fetch images" };
};

export const addCarouselImage = async (folderPath, formData) => {
  const response = await axios.post(
    `${baseURL}/api/carousel/${folderPath}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const adjustCarouselOrder = async (folderPath, newOrderArray) => {
  const response = await axios.patch(
    `${baseURL}/api/carousel/${folderPath}`,
    newOrderArray
  );
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};

export const deleteCarouselImage = async (folderPath, publicId, id) => {
  const response = await axios.delete(`${baseURL}/api/carousel/${folderPath}`, {
    params: { publicId, id },
  });
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};
