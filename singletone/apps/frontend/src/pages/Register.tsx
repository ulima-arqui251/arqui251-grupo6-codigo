import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.values(form).some(v => v.trim() === '')) {
            setError('Completa todos los campos');
            setShowModal(true);
            return;
        }

        if (form.password !== form.repeatPassword) {
            setError('Las contraseñas no coinciden');
            setShowModal(true);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name,
                    lastName: form.lastName,
                    nickname: form.nickname,
                    email: form.email,
                    password: form.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Error en el registro');
                setShowModal(true);
                return;
            }

            console.log('✅ Usuario creado:', data);
            navigate('/login'); // ✅ Redirección al login

        } catch (err) {
            console.error('❌ Error en el fetch', err);
            setError('Fallo al conectar con el servidor');
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <p>{error}</p>
                        <button onClick={handleCloseModal}>Cerrar</button>
                    </div>
                </div>
            )}

            <div className={`register-container ${showModal ? 'blurred' : ''}`}>
                <div className="register-left">
                    <h2 className="register-title">Registro de usuario</h2>
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-row">
                            <div className="register-group">
                                <label>Nombre</label>
                                <input 
                                    name="name" 
                                    type="text"
                                    placeholder="{ escribir aquí }" 
                                    value={form.name} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="register-group">
                                <label>Apellido</label>
                                <input 
                                    name="lastName" 
                                    type="text"
                                    placeholder="{ escribir aquí }" 
                                    value={form.lastName} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="register-row">
                            <div className="register-group">
                                <label>Apodo</label>
                                <input 
                                    name="nickname" 
                                    type="text"
                                    placeholder="{ escribir aquí }" 
                                    value={form.nickname} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="register-group">
                                <label>Correo</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="{ escribir aquí }" 
                                    value={form.email} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="register-group">
                            <label>Contraseña</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="{ escribir aquí }" 
                                value={form.password} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="register-group">
                            <label>Repetir contraseña</label>
                            <input 
                                name="repeatPassword" 
                                type="password" 
                                placeholder="{ escribir aquí }" 
                                value={form.repeatPassword} 
                                onChange={handleChange} 
                            />
                        </div>

                        <button type="submit" className="register-button">
                            Crear cuenta
                        </button>

                        <p className="login-link" onClick={() => navigate('/login')}>
                            Ya tengo una cuenta
                        </p>
                    </form>
                </div>

                <div className="register-right">
                    <div className="register-logo">
                        <div className="register-logo">
                        <img src="/src/assets/singletone-logo-white.svg" alt="Logo" width="200" height="200" />
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;