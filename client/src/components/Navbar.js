import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: '#1976d2', padding: '10px 20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
                        Трекер привычек
                    </Link>
                </div>

                <div>
                    {isAuthenticated ? (
                        <>
                            <span style={{ marginRight: '15px' }}>Привет, {user?.username}!</span>
                            <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '10px' }}>Вход</Link>
                            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Регистрация</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;