import { useEffect, useState } from 'react';
import AlbumCard from '../components/AlbumCard';
import './ProfileAlbums.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileAlbums = () => {
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'todos' | 'to_value' | 'valued'>('todos');
    const [currentPage, setCurrentPage] = useState(0);

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
            } catch (err: any) {
                setError('Error al cargar los álbumes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    const itemsPerPage = 12;
    const filteredAlbums = activeTab === 'todos' ? albums : albums.filter((a: any) => a.rank_state === activeTab);
    const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDisplayItems = filteredAlbums.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    const handleTabChange = (tab: 'todos' | 'to_value' | 'valued') => {
        setActiveTab(tab);
        setCurrentPage(0);
    };

    if (loading) return <p>⏳ Cargando álbumes...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="profile-albums-page">
            <div className="profile-albums-container">
                <h1>Mis Álbumes</h1>
                
                <div className="library-section">
                    <div className="library-container">
                        <div className="tabs-container">
                            <button
                                className={`tab ${activeTab === 'todos' ? 'active' : ''}`}
                                onClick={() => handleTabChange('todos')}
                            >
                                Todos
                            </button>
                            <button
                                className={`tab ${activeTab === 'to_value' ? 'active' : ''}`}
                                onClick={() => handleTabChange('to_value')}
                            >
                                Por valorar
                            </button>
                            <button
                                className={`tab ${activeTab === 'valued' ? 'active' : ''}`}
                                onClick={() => handleTabChange('valued')}
                            >
                                Valorados
                            </button>
                        </div>
                        
                        <div className="library-content">
                            {currentDisplayItems.length === 0 ? (
                                <p className="empty-message">
                                    No hay álbumes en esta categoría.
                                </p>
                            ) : (
                                <div className="carousel-grid">
                                    {currentDisplayItems.map((album: any, index: number) => (
                                        <div key={index} className="carousel-item">
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
                        
                        <div className="library-footer">
                            <button className="carousel-btn prev" onClick={handlePrevPage}>
                                <img src="src/assets/back.png" alt="Anterior" />
                            </button>
                            <button className="carousel-btn next" onClick={handleNextPage}>
                                <img src="src/assets/next.png" alt="Siguiente" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAlbums;