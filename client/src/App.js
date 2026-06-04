import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import HabitList from './components/HabitList';  // ← импортируем

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={
                        <PublicRoute>
                            <LoginForm />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <RegisterForm />
                        </PublicRoute>
                    } />
                    <Route path="/tasks" element={
                        <PrivateRoute>
                            <HabitList />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={
                        <PrivateRoute>
                            <HabitList />
                        </PrivateRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;