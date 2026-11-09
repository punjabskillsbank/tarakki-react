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
  if (!token || typeof window === "undefined") {
    return requestConfig;
  }

  const requestUrl = new URL(
    requestConfig.url ?? "",
    new URL(requestConfig.baseURL ?? config.baseURLs.apiRoot, window.location.origin),
  );
  const trustedOrigins = new Set(
    Object.values(config.baseURLs).map(
      (baseURL) => new URL(baseURL, window.location.origin).origin,
    ),
  );
  const isLoginRequest = requestUrl.pathname.endsWith(config.endpoints.login);

  if (trustedOrigins.has(requestUrl.origin) && !isLoginRequest) {
    requestConfig.headers.set("Authorization", `Bearer ${token}`);
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
