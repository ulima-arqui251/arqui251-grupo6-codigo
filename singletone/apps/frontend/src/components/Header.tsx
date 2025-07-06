import { Link, Outlet, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Más adelante: cerrar sesión, limpiar token, etc.
        navigate('/login');
    };

    return (
        <>
        <header style={{ padding: '1rem', background: '#eee' }}>
            <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/home_page">Inicio</Link>
            <Link to="/search">Buscar</Link>
            <Link to="/profile">Perfil</Link>
            <Link to="/recommendation">Recomendaciones</Link>
            <button onClick={handleLogout}>Cerrar sesión</button>
            </nav>
        </header>
        <main style={{ padding: '2rem' }}>
            <Outlet />
        </main>
        </>
    );
};

export default Header;