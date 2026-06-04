import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string()
        .min(3, 'Имя пользователя должно содержать минимум 3 символа')
        .max(100, 'Имя пользователя не может превышать 100 символов')
        .required('Имя пользователя обязательно'),
    email: Yup.string()
        .email('Некорректный формат email')
        .required('Email обязателен'),
    password: Yup.string()
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .required('Пароль обязателен'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
        .required('Подтверждение пароля обязательно')
});

const RegisterForm = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await register(
                    values.username,
                    values.email,
                    values.password,
                    values.confirmPassword
                );
                if (result?.success) {
                    navigate('/tasks');
                }
            } catch (err) {
                setError(err.response?.data?.detail || 'Ошибка регистрации');
            }
        }
    });

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>Регистрация</h2>

            {error && (
                <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Имя пользователя</label>
                    <input
                        type="text"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.username}</div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
                    )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Подтверждение пароля</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.confirmPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Зарегистрироваться
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default RegisterForm;