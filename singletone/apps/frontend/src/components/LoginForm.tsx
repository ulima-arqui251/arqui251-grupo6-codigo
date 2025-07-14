import React from 'react';
import InputField from './InputField';
import LoginButton from './LoginButton';

interface LoginFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleLogin: (e: React.FormEvent) => void;
    }

    const LoginForm: React.FC<LoginFormProps> = ({
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    }) => {
    return (
        <div className="login-form">
        <h1 className="title">Singletone</h1>
        <div className="logo-container">
            <img src="/src/assets/singletone-logo-grey.svg" alt="Logo" className="logo-image" />
        </div>
        <form onSubmit={handleLogin}>
            <div className="textfield-group">
            <InputField
                id="email"
                type="text"
                label="Usuario"
                placeholder="{ escribe aquí }"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                id="password"
                type="password"
                label="Contraseña"
                placeholder="{ escribe aquí }"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <LoginButton text="Iniciar Sesión" />
        </form>
        <p className="register-link">
            <a href="/register">Crea una cuenta aquí</a>
        </p>
        </div>
    );
};

export default LoginForm;