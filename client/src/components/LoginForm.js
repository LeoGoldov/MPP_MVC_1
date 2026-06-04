import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const validationSchema = Yup.object({
    username: Yup.string().required('Имя пользователя обязательно'),
    password: Yup.string().required('Пароль обязателен')
});

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const result = await login(values.username, values.password);
            if (result.success) {
                navigate('/tasks');
            } else {
                setError(result.error);
            }
        }
    });

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>Вход</h2>

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

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Войти
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default LoginForm;