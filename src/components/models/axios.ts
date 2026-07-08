import axios from "axios";
import Cookies from "js-cookie";

export const baseBackendUrl = "https://dummyjson.com/";

export const api = axios.create({
  baseURL: baseBackendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
