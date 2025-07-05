import { useEffect, useState } from 'react';

export function App() {
  const [status, setStatus] = useState('Conectando...');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const users = await fetch('http://localhost/api/users').then(res => res.json());
        console.log('🎧 Usuario:', users);

        // const artists = await fetch('http://localhost/api/music/artists').then(res => res.json());
        // console.log('🎤 Artistas:', artists);

        // const albums = await fetch('http://localhost/api/music/albums').then(res => res.json());
        // console.log('🎵 Biblioteca:', albums);

        setStatus('✅ Conexión exitosa. Ver consola del navegador.');
      } catch (error) {
        console.error('❌ Error al conectar con la API Gateway:', error);
        setStatus('❌ Error al conectar. Revisa consola.');
      }
    };

    fetchAll();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Singletone Frontend 🎶</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;