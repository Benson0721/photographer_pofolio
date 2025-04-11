import axios from "axios";

const baseURL = window.location.origin;

export const uploadTopicImage = (formData) => {
  const response = axios.post(`${baseURL}/api/category`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Upload failed" };
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

