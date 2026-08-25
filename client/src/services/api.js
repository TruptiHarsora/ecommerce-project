import axios from "axios";
import { getToken, removeToken, setToken } from "../utils/token";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    // console.log("intercepter token :", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return error;
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log("Original Request", originalRequest);

    if (
      error.response?.status == 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh-token");
        // console.log("refresh-token data: ", data, "token:", data.token);

        setToken(data.token);

        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        return api(originalRequest);
      } catch (error) {
        console.error("Refresh token expired");
        removeToken();
        // window.location.href = "/";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
