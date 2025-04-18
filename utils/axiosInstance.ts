/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Function to get the API configuration
const getApiConfig = () => {
  if (typeof window !== 'undefined') {
    const env = window as unknown as { __ENV__?: { NEXT_PUBLIC_CLIENT_API_HOST: string; NEXT_PUBLIC_API_KEY: string } };

    if (env.__ENV__) {
      return {
        baseURL: env.__ENV__.NEXT_PUBLIC_CLIENT_API_HOST,
        apiKey: env.__ENV__.NEXT_PUBLIC_API_KEY,
      };
    }
  }
  
  return {
    baseURL: 'http://pntdev.ddns.net:28080/api',
    apiKey: '2c5SF8BDhWKzdTY5MIFXEh9PummQMhK8w2TIUobJnYbAxaUmYo1sYTc2Hwo3xNWj',
  };
};

const { baseURL, apiKey } = getApiConfig();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'accept': 'application/json',
    'X-ApiKey': apiKey,
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple refresh calls at the same time
let isRefreshing = false;
let failedQueue: any[] = [];

// Function to process the failed request queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

// Response interceptor: Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized), try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue failed requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Send refresh token request
        const refreshResponse = await axios.post(`${baseURL}/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Process the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
