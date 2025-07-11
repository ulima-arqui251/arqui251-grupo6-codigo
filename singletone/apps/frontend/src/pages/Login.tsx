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
                <h1 className="title">SingletoneEEEEEEEEEEE</h1>
                
                <div className="logo-container">
                <img src="/src/assets/singletone-logo-grey.svg" alt="Logo" className="logo-image" />
                </div>

                <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="email">Usuario</label>
                    <input
                    id="email"
                    type="text"
                    placeholder="{ escribe aquí }"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                    id="password"
                    type="password"
                    placeholder="{ escribe aquí }"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button type="submit" className="login-button">Iniciar Sesión</button>
                </form>
                
                <p className="register-link">
                    <a href="/register">Crea una cuenta aquí</a>
                </p>
            </div>
            
            <div className="login-image">
                <img src="/src/assets/album_login_background.png" alt="Vinyl Records Background" />
            </div>
        </div>
    );
}