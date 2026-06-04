import api from './api';

const habitService = {
    // Получить все привычки пользователя
    async getHabits() {
        const response = await api.get('/habitapi');
        console.log('habitService raw response:', response);
        console.log('habitService data:', response.data);
        console.log('is array?', Array.isArray(response.data));
        return response.data;
    },

    // Получить одну привычку по ID
    async getHabit(id) {
        const response = await api.get(`/habitapi/${id}`);
        return response.data;
    },

    // Создать привычку
    async createHabit(habit) {
        const response = await api.post('/habitapi', habit);
        return response.data;
    },

    // Обновить привычку
    async updateHabit(id, habit) {
        const response = await api.put(`/habitapi/${id}`, habit);
        return response.data;
    },

    // Удалить привычку
    async deleteHabit(id) {
        await api.delete(`/habitapi/${id}`);
    }
};

export default habitService;