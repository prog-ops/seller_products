import axios from 'axios';

/**
 * Axios instance terpusat.
 * Semua API call harus melalui instance ini, bukan axios langsung.
 * - Base URL diambil dari environment variable
 * - Token otomatis di-attach via request interceptor
 * - 401 response otomatis redirect ke login via response interceptor
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 15000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
