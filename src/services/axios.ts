import axios from 'axios';
import config from '../config/indexConfig';

const API = axios.create({
  baseURL: config.baseURLs.apiRoot,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
