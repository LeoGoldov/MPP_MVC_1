import axios from 'axios';
import authService from './authService';

const api = axios.create({
    baseURL: 'https://localhost:7200/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor – добавляем токен к каждому запросу
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log('Interceptor: token =', token); // ← отладка
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Interceptor: Authorization header set');
        } else {
            console.log('Interceptor: NO token found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;