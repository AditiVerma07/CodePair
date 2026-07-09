import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true // Crucial to allow browsers to accept HttpOnly refresh cookies
});

// Axios Request Interceptor: Automatically appends short-lived memory access tokens
let memoryToken = null;

export const setAccessToken = (token) => {
  memoryToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers['Authorization'] = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor: Automatically triggers token refreshing if access expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Hit the refresh endpoint to get a fresh short-lived token via the secure cookie
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the 7-day refresh cookie expires, clear memory and redirect to login
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
