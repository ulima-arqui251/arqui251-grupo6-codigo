import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlbumCard from '../components/AlbumCard';
import './Artist.css';

const API_URL = import.meta.env.VITE_API_URL;

const MyArtist = () => {
    const { artistId } = useParams();
    const [artist, setArtist] = useState<any>(null);
    const [userAlbums, setUserAlbums] = useState<any[]>([]);
    const [songCount, setSongCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [artistUser, setArtistUser] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                // ✅ Llamada SOLO al microservicio music para obtener datos base del artista
                const resArtist = await fetch(`${API_URL}/music/artists/${artistId}`, { headers });
                const artistData = await resArtist.json();
                setArtist({
                    name: artistData.name,
                    picture_url: artistData.picture_url,
                    genre: artistData.genre || '—',
                    debut_year: artistData.debut_year?.split('T')[0] ?? '—'
                });

                // ✅ Llamadas al library-service para datos del usuario
                const [userAlbumsRes, userArtistsRes] = await Promise.all([
                    fetch(`${API_URL}/library/albums/${userId}`, { headers }),
                    fetch(`${API_URL}/library/artists/${userId}`, { headers })
                ]);

                const userAlbumsData = await userAlbumsRes.json();
                const userArtistAlbums = userAlbumsData.filter((a: any) => a.artist_id === artistId);

                const fullAlbumsRes = await fetch(`${API_URL}/music/albums`, { headers });
                const fullAlbums = await fullAlbumsRes.json();

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

                const songUserEntries = await Promise.all(
                    userArtistAlbums.map(async (album: any) => {
                        const res = await fetch(`${API_URL}/library/songs/${userId}/${album.album_id}`, { headers });
                        return await res.json();
                    })
                );
                setSongCount(songUserEntries.flat().length);

            } catch (err: any) {
                setError('Error al cargar el artista');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artistId]);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(userAlbums.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDisplayAlbums = userAlbums.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    if (loading) return <p>⏳ Cargando artista...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="artist-page">
            <div className="artist-container">
                <h1 className="artist-title">Artista</h1>
                <div className="artist-picture-container">
                    <div className="artist-picture">
                        <img src={artist.picture_url} alt={artist.name} />
                    </div>
                </div>
                <h2 className="artist-name">{artist.name}</h2>
                <p className="artist-genre">Género principal: {artist.genre}</p>
                <div className="artist-stats">
                    <div className="stat-item">
                        <div className="stat-label">N° Albums</div>
                        <div className="stat-number light">{userAlbums.length}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Año fundación</div>
                        <div className="stat-number dark">{new Date(artist.debut_year).getFullYear()}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">N° Canciones</div>
                        <div className="stat-number light">{songCount}</div>
                    </div>
                </div>
            </div>

            <div className="albums-section">
                <div className="albums-container">
                    <div className="tabs-container">
                        <button className="tab active">
                            Albums
                        </button>
                    </div>
                    
                    <div className="albums-content">
                        {currentDisplayAlbums.length === 0 ? (
                            <p className="empty-message">
                                No tienes álbumes de este artista en tu biblioteca
                            </p>
                        ) : (
                            <div className="albums-grid">
                                {currentDisplayAlbums.map((album: any) => (
                                    <div key={album.albumId} className="album-item">
                                        <AlbumCard
                                            albumId={album.albumId}
                                            title={album.title}
                                            cover_url={album.cover_url}
                                            average_score={album.average_score}
                                            rank_state={album.rank_state}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {currentDisplayAlbums.length > 0 && totalPages > 1 && (
                        <div className="albums-footer">
                            <button className="carousel-btn prev" onClick={handlePrevPage}>
                                <img src="src/assets/back.png" alt="Anterior" />
                            </button>
                            <button className="carousel-btn next" onClick={handleNextPage}>
                                <img src="src/assets/next.png" alt="Siguiente" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyArtist;