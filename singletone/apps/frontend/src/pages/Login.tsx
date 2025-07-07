import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Error de autenticación');
            return;
        }

        localStorage.setItem('token', data.token);
        navigate('/home_page');
        } catch (err) {
        alert('Fallo en el login');
        console.error(err);
        }
    };

    return (
        <div className="login-container">
        <div className="login-form">
            <h1>Singletone</h1>
            <div className="logo-placeholder">LOGO</div>
            <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Iniciar Sesión</button>
            </form>
            <p className="register-link">¿No tienes cuenta? <a href="/register">Créala aquí</a></p>
        </div>
        <div className="login-image" />
        </div>
    );
}