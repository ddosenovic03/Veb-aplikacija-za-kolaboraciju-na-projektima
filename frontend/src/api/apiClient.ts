import axios from "axios";
import { KORISNIK_STORAGE_KEY, TOKEN_STORAGE_KEY } from "../utils/authStorage";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";
export const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
    
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use((response) => response, (error) => {
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(KORISNIK_STORAGE_KEY);
    }

    return Promise.reject(error);
});