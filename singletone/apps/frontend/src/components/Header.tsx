import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Función para determinar si una ruta está activa
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Función para obtener el icono correcto según el estado
  const getIcon = (baseName: string, isSelected: boolean) => {
    const suffix = isSelected ? '_selected' : '';
    return `src/assets/icon_menubar_${baseName}${suffix}.png`;
  };

  const navItems = [
    { path: '/home_page', icon: '01', label: 'Inicio' },
    { path: '/search', icon: '02', label: 'Buscar' },
    { path: '/profile', icon: '03', label: 'Perfil' },
    { path: '/recommendation', icon: '04', label: 'Recomendaciones' },
  ];

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
              >
                <img
                  src={getIcon(item.icon, active)}
                  alt={item.label}
                  className={`${styles.navIcon} ${!active ? styles.inactive : ''}`}
                />
              </Link>
            );
          })}
          
          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <img
              src="src/assets/icon_menubar_05.png"
              alt="Cerrar sesión"
              className={styles.logoutIcon}
            />
          </button>
        </nav>
      </header>
      
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default Header;