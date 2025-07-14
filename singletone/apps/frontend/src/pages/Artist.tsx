// src/pages/Artist.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlbumCard from '../components/AlbumCard';
import './Artist.css';

const API_URL = import.meta.env.VITE_API_URL;

const Artist = () => {
    const { artistId } = useParams();
    const [artist, setArtist] = useState<any>(null);
    const [albums, setAlbums] = useState<any[]>([]);
    const [songCount, setSongCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [artistUser, setArtistUser] = useState<any>(null);

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                // 🎯 Obtener datos del artista
                const resArtist = await fetch(`${API_URL}/music/artists/${artistId}`, { headers });
                const artistData = await resArtist.json();
                setArtist({
                    name: artistData.name,
                    picture_url: artistData.picture_url,
                    genre: artistData.genre || '—',
                    debut_year: artistData.debut_year?.split('T')[0] ?? '—'
                });

                // 🎯 Obtener álbumes del artista
                const resAlbums = await fetch(`${API_URL}/music/albums/artist/${artistId}`, { headers });
                const artistAlbums = await resAlbums.json();
                setAlbums(artistAlbums);

                // 🎯 Obtener canciones
                const resSongs = await fetch(`${API_URL}/music/songs/artist/${artistId}`, { headers });
                const songs = await resSongs.json();
                setSongCount(songs.length);

                // 🎯 Verificar si el usuario ya tiene al artista
                const resUserArtists = await fetch(`${API_URL}/library/artists/${userId}`, { headers });
                const userArtistList = await resUserArtists.json();
                const userArtist = userArtistList.find((a: any) => a.artist_id === artistId);
                setArtistUser(userArtist);
            } catch (err: any) {
                setError('Error al cargar el artista');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId]);

    const handleAddArtist = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const payload = { userId, artistId, albumId: null };

            const res = await fetch(`${API_URL}/library/add-album`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || 'Artista agregado');
                window.location.reload();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error('Error al agregar artista:', err);
            alert('Error al agregar artista');
        }
    };

    if (loading) return <p>⏳ Cargando artista...</p>;
    if (error) return <p>❌ {error}</p>;

    const isAdded = !!artistUser;

    const renderedAlbums = albums.map((album: any, index: number) => ({
        albumId: album._id || index,
        title: album.title,
        cover_url: album.cover_url,
        average_score: '—',
        rank_state: null
    }));

    return (
        <div className="artist-detail">
            <h1>Artista</h1>
            <img className="circle" src={artist.picture_url} alt={artist.name} width={150} />
            <h2>{artist.name}</h2>
            <p><strong>Género:</strong> {artist.genre}</p>
            <p><strong>Año Debut:</strong> {new Date(artist.debut_year).getFullYear()}</p>
            <p><strong>N° Álbumes:</strong> {albums.length}</p>
            <p><strong>N° Canciones:</strong> {songCount}</p>
            {isAdded && <p><strong>Estado:</strong> {artistUser?.rank_state}</p>}

            <h3>Álbumes</h3>
            <div className="artist-albums-scroll">
                {renderedAlbums.map((album: any) => (
                    <AlbumCard
                        key={album.albumId}
                        albumId={album.albumId}
                        title={album.title}
                        cover_url={album.cover_url}
                        average_score={album.average_score}
                        rank_state={album.rank_state}
                    />
                ))}
            </div>

            {!isAdded && (
                <button onClick={handleAddArtist}>➕ Agregar artista</button>
            )}
        </div>
    );
};

export default Artist;