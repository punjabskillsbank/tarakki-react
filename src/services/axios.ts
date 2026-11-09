import axios from 'axios';
import config from '../config/indexConfig';

const API = axios.create({
  baseURL: config.baseURLs.apiRoot,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const trustedOrigins = new Set(
  Object.values(config.baseURLs).map((baseURL) =>
    new URL(baseURL, window.location.origin).origin
  )
);

API.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  const requestUrl = new URL(request.url ?? '', window.location.origin);

  if (token && trustedOrigins.has(requestUrl.origin)) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  return request;
});

export default API;
