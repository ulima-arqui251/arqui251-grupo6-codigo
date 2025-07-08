// src/pages/Album.tsx
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Album.css';

const API_URL = import.meta.env.VITE_API_URL;

const Album = () => {
    const { albumId } = useParams();
    const location = useLocation();
    const [album, setAlbum] = useState<any>(null);
    const [songs, setSongs] = useState<any[]>([]);
    const [userAlbum, setUserAlbum] = useState<any>(null);
    const [ratings, setRatings] = useState<number[]>([]);
    const [averageScore, setAverageScore] = useState<number | string>('—'); // 👈 manejamos el score aquí
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Obtener álbum y canciones
                const [albumRes, songsRes] = await Promise.all([
                    fetch(`${API_URL}/music/albums/album/${albumId}`, { headers }),
                    fetch(`${API_URL}/music/songs/album/${albumId}`, { headers })
                ]);

                const albumData = await albumRes.json();
                const songsData = await songsRes.json();
                setAlbum(albumData);
                setSongs(songsData);

                // 2. Álbum del usuario
                const userAlbumRes = await fetch(`${API_URL}/library/albums/${userId}`, { headers });
                const userAlbums = await userAlbumRes.json();
                const match = userAlbums.find((a: any) => a.album_id === albumId);
                if (match) {
                    setUserAlbum(match);
                    // Obtener resumen y notas
                    const summaryRes = await fetch(`${API_URL}/library/summary/${userId}`, { headers });
                    const summary = await summaryRes.json();
                    const albumSummary = summary.albums.find((a: any) => a.albumId === albumId);

                    if (albumSummary) {
                        setAverageScore(albumSummary.average_score ?? '—');
                        if (albumSummary.rank_state === 'valued') {
                            const ratingsRes = await fetch(`${API_URL}/library/songs/${userId}/${albumId}`, { headers });
                            const ratingsData = await ratingsRes.json();
                            const filled = songsData.map((song: any) => {
                                const match = ratingsData.find((r: any) => r.song_id === song._id);
                                return match?.score ?? 80;
                            });
                            setRatings(filled);
                        } else {
                            setRatings(new Array(songsData.length).fill(80));
                        }
                    }
                } else {
                    setRatings(new Array(songsData.length).fill(80));
                }

                // 3. Si hay location.state y no se ha seteado aún
                if (location.state?.average_score && averageScore === '—') {
                    setAverageScore(location.state.average_score);
                }
            } catch (err: any) {
                setError('Error al cargar álbum');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [albumId]);

    const handleRate = async (url: string) => {
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const payload = {
            userId,
            artistId: album.artist_id,
            albumId: album._id,
            ratings: songs.map((song, i) => ({
                songId: song._id,
                score: ratings[i]
            }))
        };

        const res = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message || 'Valoración exitosa.');

            const summaryRes = await fetch(`${API_URL}/library/summary/${userId}`, { headers });
            const summary = await summaryRes.json();
            const albumSummary = summary.albums.find((a: any) => a.albumId === albumId);

            if (albumSummary) {
                setUserAlbum((prev: any) => ({
                    ...prev,
                    rank_state: 'valued',
                    rank_date: prev?.rank_date
                }));
                setAverageScore(albumSummary.average_score);
            }
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    const handleAdd = async () => {
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const payload = {
            userId,
            albumId: album._id,
            artistId: album.artist_id
        };

        const res = await fetch(`${API_URL}/library/add-album`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            alert('Álbum agregado a tu biblioteca');
            setUserAlbum({ ...payload, rank_state: 'to_value' });
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    if (loading) return <p>⏳ Cargando álbum...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="album-detail">
            <h1>{album.title}</h1>
            <img src={album.cover_url} alt={album.title} width={200} />
            <p><strong>Año:</strong> {album.release_year}</p>
            <p><strong>Nota:</strong> {userAlbum?.rank_state === 'valued' ? averageScore : '—'}</p>
            {userAlbum?.rank_date && (
                <p><strong>Año (escucha):</strong> {new Date(userAlbum.rank_date).getFullYear()}</p>
            )}
            <p><strong>Estado:</strong> {userAlbum?.rank_state || 'No agregado'}</p>

            <div>
                <h2>Canciones</h2>
                <ul>
                    {songs.map((song, index) => (
                        <li key={song._id}>
                            {song.name}
                            {userAlbum && (
                                <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={ratings[index]}
                                    onChange={(e) => {
                                        const updated = [...ratings];
                                        updated[index] = parseInt(e.target.value);
                                        setRatings(updated);
                                    }}
                                    style={{ marginLeft: '10px' }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {!userAlbum ? (
                <button onClick={handleAdd}>➕ Añadir álbum</button>
            ) : userAlbum.rank_state === 'to_value' ? (
                <button onClick={() => handleRate('/library/rate-album')}>⭐ Valorar álbum</button>
            ) : (
                <button onClick={() => handleRate('/library/update-album-rating')}>🔁 Actualizar valoración</button>
            )}
        </div>
    );
};

export default Album;