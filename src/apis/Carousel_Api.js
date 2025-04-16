import axios from "axios";
const baseURL = window.location.origin;

export const getCarouselImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/carousel/${folderPath}`);
  if (response.status === 200) {
    return response.data.carouselImages;
  }
  return { error: "Failed to fetch images" };
};

export const addCarouselImage = async (folderPath, formData) => {
  console.log("前端");
  const response = await axios.post(
    `${baseURL}/api/carousel/${folderPath}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: response.data.error };
};

export const adjustCarouselOrder = async (folderPath, newOrderArray) => {
  console.log("前端");
  const response = await axios.patch(
    `${baseURL}/api/carousel/${folderPath}`,
    newOrderArray
  );
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};

export const deleteCarouselImage = async (folderPath, publicId, id) => {
  console.log("前端");
  const response = await axios.delete(`${baseURL}/api/carousel/${folderPath}`, {
    params: { publicId, id },
  });
  console.log(response);
  if (response.status === 200) {
    return response;
  }
  return { error: "Failed to add images" };
};
