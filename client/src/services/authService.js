import axios from 'axios';

const API_URL = 'https://localhost:7200/api';

const authService = {
    // Регистрация
    async register(username, email, password, confirmPassword) {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
            confirmPassword
        });
        return response.data;
    },

    // Вход и получение JWT токенов
    async login(username, password) {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });

        if (response.data.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Обновление access токена
    async refreshToken() {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return null;

        try {
            const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken
            });

            if (response.data.accessToken) {
                localStorage.setItem('access_token', response.data.accessToken);
            }
            return response.data;
        } catch (error) {
            this.logout();
            return null;
        }
    },

    // Выход
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    // Получение текущего пользователя
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    // Проверка авторизации
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }
};

export default authService;