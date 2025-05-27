import React from 'react';

export function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #ccc', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50' }}>🎵 Singletone Demo</h1>
        <p style={{ color: '#7f8c8d' }}>Plataforma de Recomendaciones Musicales</p>
      </header>
      
      <main>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Gestión de Usuarios</h2>
            <p>Registro, autenticación y gestión de perfiles</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>

          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Perfil de Usuario</h2>
            <p>Visualización de estadísticas y perfil</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>

          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Exploración Musical</h2>
            <p>Búsqueda y descubrimiento de música</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>
          
          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Biblioteca Personal</h2>
            <p>Gestión de biblioteca y valoraciones</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>
          
          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Recomendaciones</h2>
            <p>IA para recomendaciones personalizadas</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>
          
          <div style={{ border: '1px solid #ecf0f1', padding: '20px', borderRadius: '8px' }}>
            <h2>Planes Premium</h2>
            <p>Gestión de suscripciones con Stripe</p>
            <small style={{ color: '#95a5a6' }}>Status: Demo Ready</small>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Arquitectura Implementada</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>Frontend: React con Vite</li>
            <li>Backend: Microservicios Node.js/Express</li>
            <li>Bases de datos: PostgreSQL + MongoDB + Redis</li>
            <li>Containerización: Docker</li>
            <li>Autenticación: JWT + IdP</li>
            <li>Pagos: Stripe Integration</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;