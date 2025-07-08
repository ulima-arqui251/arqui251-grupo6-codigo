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
    const [userAlbums, setUserAlbums] = useState<any[]>([]);
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

                const resArtist = await fetch(`${API_URL}/music/artists/${artistId}`, { headers });
                const artistData = await resArtist.json();
                setArtist(artistData);

                const resAlbums = await fetch(`${API_URL}/music/albums`, { headers });
                const allAlbums = await resAlbums.json();
                const artistAlbums = allAlbums.filter((a: any) => a.artist_id === artistId);
                setAlbums(artistAlbums);

                const [userAlbumsRes, userArtistsRes] = await Promise.all([
                    fetch(`${API_URL}/library/albums/${userId}`, { headers }),
                    fetch(`${API_URL}/library/artists/${userId}`, { headers })
                ]);

                const userAlbumsData = await userAlbumsRes.json();
                const userArtistAlbums = userAlbumsData.filter((a: any) => a.artist_id === artistId);

                const fullAlbums = allAlbums; // ya los trajiste arriba

                const enrichedUserAlbums = await Promise.all(userArtistAlbums.map(async (ua: any) => {
                    const fullAlbum = fullAlbums.find((a: any) => a._id === ua.album_id);
                    if (!fullAlbum) return null;

                    let average_score = '—';
                    if (ua.rank_state === 'valued') {
                        const resRatings = await fetch(`${API_URL}/library/songs/${userId}/${ua.album_id}`, { headers });
                        const ratings = await resRatings.json();
                        if (ratings.length > 0) {
                            const total = ratings.reduce((acc: number, r: any) => acc + r.score, 0);
                            average_score = `${Math.round(total / ratings.length)}`;
                        }
                    }

                    return {
                        albumId: ua.album_id,
                        title: fullAlbum.title,
                        cover_url: fullAlbum.cover_url,
                        rank_state: ua.rank_state,
                        average_score
                    };
                }));

                setUserAlbums(enrichedUserAlbums.filter(Boolean));

                const artistDataList = await userArtistsRes.json();
                const userArtist = artistDataList.find((a: any) => a.artist_id === artistId);
                setArtistUser(userArtist);

                if (userArtist) {
                    const songUserEntries = await Promise.all(
                        userArtistAlbums.map(async (album: any) => {
                            const res = await fetch(`${API_URL}/library/songs/${userId}/${album.album_id}`, { headers });
                            return await res.json();
                        })
                    );
                    setSongCount(songUserEntries.flat().length);
                } else {
                    const resSongs = await fetch(`${API_URL}/music/songs/artist/${artistId}`, { headers });
                    const artistSongs = await resSongs.json();
                    setSongCount(artistSongs.length);
                }

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

    const renderedAlbums = (isAdded ? userAlbums : albums).map((album: any, index: number) => ({
        albumId: album.albumId || album._id || album.album_id,
        title: album.title,
        cover_url: album.cover_url,
        rank_state: album.rank_state,
        average_score: album.average_score ?? '—'
    }));

    return (
        <div className="artist-detail">
            <h1>Artista</h1>
            <img className="circle" src={artist.picture_url} alt={artist.name} width={150} />
            <h2>{artist.name}</h2>
            <p><strong>Género:</strong> {artist.genre}</p>
            <p><strong>Año Fundación:</strong> {artist.founding_year}</p>
            <p><strong>N° Álbumes:</strong> {isAdded ? userAlbums.length : albums.length}</p>
            <p><strong>N° Canciones:</strong> {songCount}</p>
            {isAdded && <p><strong>Estado:</strong> {artistUser?.rank_state}</p>}

            <h3>Álbumes</h3>
            <div className="artist-albums-scroll">
                {renderedAlbums.map((album: any, index: number) => (
                    <AlbumCard
                        key={album.albumId || index}
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