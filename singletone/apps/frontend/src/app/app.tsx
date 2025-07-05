import { useEffect, useState } from 'react';

export function App() {
  const [status, setStatus] = useState('Conectando...');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const users = await fetch(`${API_URL}/users/`).then(res => res.json());
        console.log('🎧 Usuario:', users);

        const usersFull = await fetch(`${API_URL}/users/full/`).then(res => res.json());
        console.log('🦋 Usuarios—DataFull:', usersFull);

        const oneUser = await fetch(`${API_URL}/users/101/`).then(res => res.json());
        console.log('💼 Usuario—Único:', oneUser);

        const artists = await fetch(`${API_URL}/music/artists/`).then(res => res.json());
        console.log('♠️ Artistas:', artists);

        const albums = await fetch(`${API_URL}/music/albums/`).then(res => res.json());
        console.log('☃️ Albums:', albums);

        const songs = await fetch(`${API_URL}/music/songs/`).then(res => res.json());
        console.log('🪗 Songs:', songs);

        const genres = await fetch(`${API_URL}/music/albums/`).then(res => res.json());
        console.log('📕 Usuario—Único:', genres);

        setStatus('✅ Conexión exitosa. Ver consola del navegador.');
      } catch (error) {
        console.error('❌ Error al conectar con la API Gateway:', error);
        setStatus('❌ Error al conectar. Revisa consola.');
      }
    };

    fetchAll();
  }, [API_URL]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Singletone Frontend 🎶</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;