import axios from "axios";

const baseURL = window.location.origin;

export const register = async (formData) => {
  const response = await axios.post(`${baseURL}/api/register`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Register failed" };
};

export const login = async (formData) => {
  const response = await axios.post(`${baseURL}/api/login`, formData);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Login failed" };
};

export const logout = async () => {
  const response = await axios.get(`${baseURL}/api/logout`);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Logout failed" };
};

export const checkAuth = async () => {
  const response = await axios.get(`${baseURL}/api/checkAuth`);
  if (response.status === 200) {
    return response.data;
  }
  return { error: "Check auth failed" };
};
