import axios from "axios";

const baseURL = window.location.origin;

export const getImages = async (folderPath) => {
  const response = await axios.get(`${baseURL}/api/images/${folderPath}`);
  if (response.status === 200) {
    return response.data.images;
  }
  return { error: "Failed to fetch images" };
};

export const login = (formData) => {
  const response = axios.post(`${baseURL}/api/login`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Login failed" };
};

export const logout = () => {
  const response = axios.get(`${baseURL}/api/logout`);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Logout failed" };
};
