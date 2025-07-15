// src/pages/ProfileAlbums.tsx
import { useEffect, useState } from 'react';
import AlbumCard from '../components/AlbumCard';
import './ProfileAlbums.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileAlbums = () => {
    const [albums, setAlbums] = useState<any[]>([]);
    const [filteredAlbums, setFilteredAlbums] = useState<any[]>([]);
    const [filter, setFilter] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const res = await fetch(`${API_URL}/library/albums/${userId}`, { headers });
                const userAlbums = await res.json();

                const fullAlbumsRes = await fetch(`${API_URL}/music/albums`, { headers });
                const fullAlbums = await fullAlbumsRes.json();

                const enriched = await Promise.all(userAlbums.map(async (ua: any) => {
                    const full = fullAlbums.find((a: any) => a._id === ua.album_id);
                    if (!full) return null;

                    let average_score = '—';
                    if (ua.rank_state === 'valued') {
                        const ratingsRes = await fetch(`${API_URL}/library/songs/${userId}/${ua.album_id}`, { headers });
                        const ratings = await ratingsRes.json();
                        if (ratings.length > 0) {
                            const total = ratings.reduce((acc: number, r: any) => acc + r.score, 0);
                            average_score = `${Math.round(total / ratings.length)}`;
                        }
                    }

                    return {
                        albumId: ua.album_id,
                        title: full.title,
                        cover_url: full.cover_url,
                        average_score,
                        rank_state: ua.rank_state
                    };
                }));

                const filtered = enriched.filter(Boolean);
                setAlbums(filtered);
                setFilteredAlbums(filtered);
            } catch (err: any) {
                setError('Error al cargar los álbumes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    useEffect(() => {
        if (filter === 'todos') {
            setFilteredAlbums(albums);
        } else {
            setFilteredAlbums(albums.filter((a: any) => a.rank_state === filter));
        }
    }, [filter, albums]);

    if (loading) return <p>⏳ Cargando álbumes...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="profile-albums-page">
            <h1>Mis Álbumes</h1>
            <div className="filter-buttons">
                <button onClick={() => setFilter('todos')} className={filter === 'todos' ? 'active' : ''}>Todos</button>
                <button onClick={() => setFilter('to_value')} className={filter === 'to_value' ? 'active' : ''}>Por valorar</button>
                <button onClick={() => setFilter('valued')} className={filter === 'valued' ? 'active' : ''}>Valorados</button>
            </div>

            <div className="profile-albums-scroll-vertical">
                {filteredAlbums.length === 0 ? (
                    <p>No hay álbumes en esta categoría.</p>
                ) : (
                    filteredAlbums.map((album, index) => (
                        <AlbumCard
                            key={index}
                            albumId={album.albumId}
                            title={album.title}
                            cover_url={album.cover_url}
                            average_score={album.average_score}
                            rank_state={album.rank_state}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfileAlbums;