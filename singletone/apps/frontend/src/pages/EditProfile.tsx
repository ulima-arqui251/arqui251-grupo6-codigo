import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile = () => {
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        picture: '',
        password: '',
        repeatPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        if (!token || !userId) {
            setError('Usuario no autenticado');
        }
    }, [token]);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validaciones adicionales
        if (form.password && form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (form.password && form.password !== form.repeatPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (form.picture) {
            if (!form.picture.endsWith('.jpg') && !form.picture.endsWith('.png')) {
                setError('La URL de la foto debe terminar en .jpg o .png');
                return;
            }
            if (!isValidUrl(form.picture)) {
                setError('La URL de la foto no es válida');
                return;
            }
        }

        try {
            const res = await fetch(`${API_URL}/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: form.name || undefined,
                    lastName: form.lastName || undefined,
                    picture: form.picture || undefined,
                    password: form.password || undefined
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al actualizar');

            setSuccess('Perfil actualizado con éxito ✅');
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Editar Perfil</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <label>Foto (URL)</label>
                <input type="text" name="picture" value={form.picture} onChange={handleChange} />

                <label>Nombre</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} />

                <label>Apellido</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} />

                <label>Contraseña nueva</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} />

                <label>Repetir contraseña</label>
                <input type="password" name="repeatPassword" value={form.repeatPassword} onChange={handleChange} />

                <button type="submit">Guardar cambios</button>
            </form>

            {error && <p className="error">❌ {error}</p>}
            {success && <p className="success">✅ {success}</p>}
        </div>
    );
};

export default EditProfile;