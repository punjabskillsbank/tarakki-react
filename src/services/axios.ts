import axios from 'axios';
import config from '../config/indexConfig';
import { getToken, clearAuth } from '../utils/authStorage';

const API = axios.create({
  baseURL: config.baseURLs.apiRoot,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((requestConfig) => {
  const token = getToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes(config.endpoints.login);
    const isOnLoginPage =
      typeof window !== 'undefined' && window.location.pathname === config.routes.login;

    if (error.response?.status === 401 && !isLoginRequest && !isOnLoginPage) {
      clearAuth();
      window.location.assign(config.routes.login);
    }

    return Promise.reject(error);
  }
);

export default API;
