import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./api";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach access token on every request
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function queueWhileRefreshing(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function flushQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// Refresh on 401 and retry once
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (!originalRequest) return Promise.reject(error);

    // Only handle auth failures
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      // No refresh token -> force login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueWhileRefreshing((newToken) => {
          if (!newToken) return reject(error);
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshResponse = await axios.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh: refreshToken,
      });

      const newAccess = (refreshResponse.data as any)?.access;
      if (!newAccess) {
        throw new Error("No access token returned from refresh");
      }

      localStorage.setItem("access_token", newAccess);
      flushQueue(newAccess);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return axiosClient(originalRequest);
    } catch (refreshErr) {
      flushQueue(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
