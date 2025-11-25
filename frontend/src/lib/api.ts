import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base URL for the security service
const SECURITY_SERVICE_URL = import.meta.env.VITE_SECURITY_SERVICE_URL || 'http://localhost:8082';
const STALL_SERVICE_URL = import.meta.env.VITE_STALL_SERVICE_URL || 'http://localhost:8075';

// Create axios instance with base config
const api: AxiosInstance = axios.create({
  baseURL: SECURITY_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {

      // Don't try to refresh on login/register endpoints
      if (originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (!originalRequest.url?.includes('/auth/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // No refresh token available
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${SECURITY_SERVICE_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update user info from new token
        const tokenPayload = parseJwt(accessToken);
        if (tokenPayload) {
          localStorage.setItem('user', JSON.stringify({
            userId: tokenPayload.userId,
            email: tokenPayload.sub,
            role: tokenPayload.role
          }));
        }

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear everything and redirect
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      // You might want to redirect to an unauthorized page or show a message
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

// Helper function to parse JWT
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

export interface StallResponse {
  id: number;
  code: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  price: number | string;
  isReserved: boolean;
  locationX?: number | string;
  locationY?: number | string;
}

export interface StallCreatePayload {
  code: string;
  size: string;
  price: number | string;
  isReserved: boolean;
  locationX: number | string;
  locationY: number | string;
}

export interface StallLocationUpdatePayload {
  id: number;
  locationX: number;
  locationY: number;
}

export const stallApi = {
  async fetchAll(): Promise<StallResponse[]> {
    const res = await api.get(`${STALL_SERVICE_URL}/api/stalls`);
    return res.data;
  },
  async create(payload: StallCreatePayload): Promise<StallResponse> {
    const res = await api.post(`${STALL_SERVICE_URL}/api/stalls`, payload);
    return res.data;
  },
  async update(id: number | string, payload: StallCreatePayload): Promise<StallResponse> {
    const res = await api.put(`${STALL_SERVICE_URL}/api/stalls/${id}`, payload);
    return res.data;
  },
  async delete(id: number | string): Promise<unknown> {
    const res = await api.delete(`${STALL_SERVICE_URL}/api/stalls/${id}`);
    return res.data;
  },
  async updateLocations(payload: StallLocationUpdatePayload[]): Promise<unknown> {
    const res = await api.patch(`${STALL_SERVICE_URL}/api/stalls/locations`, payload);
    return res.data;
  },
};

export default api;