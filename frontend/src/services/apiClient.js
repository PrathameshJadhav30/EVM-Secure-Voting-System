import axios from "axios";
import toast from "react-hot-toast";
import { authStorage } from "../features/auth/AuthContext";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 12000,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "Request failed";
    if (error?.response?.status !== 401) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data.data;
