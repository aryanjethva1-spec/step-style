import axios from 'axios';

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const SERVER_URL = isLocalhost
  ? 'http://localhost:5000'
  : import.meta.env.VITE_API_URL;

if (!SERVER_URL) {
  throw new Error('VITE_API_URL is not set for production');
}

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});

export const API_URL = `${SERVER_URL}/api`;
export const BASE_URL = SERVER_URL;
export default api;