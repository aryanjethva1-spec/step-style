import axios from 'axios';

// Use env variable set in .env file. Falls back to localhost for local dev.
const SERVER_URL = import.meta.env.VITE_API_URL || 
                   (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
                    ? `http://${window.location.hostname}:5000` 
                    : 'http://localhost:5000');


const api = axios.create({
    baseURL: `${SERVER_URL}/api`,
    withCredentials: true,
});

export const API_URL = `${SERVER_URL}/api`;
export const BASE_URL = SERVER_URL;

export default api;
