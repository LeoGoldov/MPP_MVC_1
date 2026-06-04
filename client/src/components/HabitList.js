import React, { useState, useEffect } from 'react';
import habitService from '../services/habitService';

const HabitList = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            setLoading(true);
            const data = await habitService.getHabits();
            setHabits(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError('Ошибка загрузки привычек');
            setHabits([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Удалить привычку?')) {
            try {
                await habitService.deleteHabit(id);
                await loadHabits();
            } catch (err) {
                setError('Ошибка удаления');
            }
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Мои привычки</h1>

            <button
                onClick={() => window.location.href = 'https://localhost:7200/Habit/Create'}
                style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                + Создать привычку
            </button>

            {habits.length === 0 ? (
                <p>У вас пока нет привычек. Создайте первую!</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Название</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Описание</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Сложность</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Прогресс</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => (
                            <tr key={habit.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px', borderLeft: `5px solid ${habit.color}` }}>
                                    {habit.title || 'Без названия'}
                                </td>
                                <td style={{ padding: '10px' }}>{habit.description || '-'}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        backgroundColor: habit.difficulty === 0 ? '#4caf50' : habit.difficulty === 1 ? '#ff9800' : '#f44336',
                                        color: 'white'
                                    }}>
                                        {habit.difficulty === 0 ? 'Лёгкая' : habit.difficulty === 1 ? 'Средняя' : 'Сложная'}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {habit.logs?.filter(l => l.isCompleted).length || 0} / {habit.logs?.length || 0}
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        onClick={() => window.location.href = `https://localhost:7200/Habit/Details/${habit.id}`}
                                        style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
                                    >
                                        Детали
                                    </button>
                                    <button
                                        onClick={() => window.location.href = `https://localhost:7200/Habit/Edit/${habit.id}`}
                                        style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#ff9800', color: 'white', border: 'none' }}
                                    >
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleDelete(habit.id)}
                                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HabitList;