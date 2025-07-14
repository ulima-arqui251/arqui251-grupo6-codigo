import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

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
            <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
            />
            <div className="login-image">
                <img src="/src/assets/album_login_background.png" alt="Vinyl Records Background" />
            </div>
        </div>
    );
}