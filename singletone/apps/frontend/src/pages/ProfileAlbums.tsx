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
    const [currentPage, setCurrentPage] = useState(0);

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    // Función para ordenar los albums
    const sortAlbums = (albums: any[]) => {
        return albums.sort((a, b) => {
            const scoreA = a.average_score;
            const scoreB = b.average_score;
            
            // Convertir strings numéricos a números para comparación
            const numScoreA = scoreA === '—' || scoreA === null || scoreA === undefined 
                ? null 
                : parseInt(scoreA);
            const numScoreB = scoreB === '—' || scoreB === null || scoreB === undefined 
                ? null 
                : parseInt(scoreB);
            
            // Si ambos tienen puntuación numérica, ordenar de mayor a menor
            if (numScoreA !== null && numScoreB !== null) {
                return numScoreB - numScoreA;
            }
            
            // Si A tiene puntuación y B no, A va primero
            if (numScoreA !== null && numScoreB === null) {
                return -1;
            }
            
            // Si B tiene puntuación y A no, B va primero
            if (numScoreB !== null && numScoreA === null) {
                return 1;
            }
            
            // Si ninguno tiene puntuación, mantener orden original
            return 0;
        });
    };

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
                // Ordenar los albums después de cargarlos
                const sortedAlbums = sortAlbums([...filtered]);
                setAlbums(sortedAlbums);
                setFilteredAlbums(sortedAlbums);
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
        let filtered;
        if (filter === 'todos') {
            filtered = albums;
        } else {
            filtered = albums.filter((a: any) => a.rank_state === filter);
        }
        
        // Ordenar los albums filtrados
        const sortedFiltered = sortAlbums([...filtered]);
        setFilteredAlbums(sortedFiltered);
        setCurrentPage(0); // Reset page when filter changes
    }, [filter, albums]);

    const itemsPerPage = 24;
    const totalPages = Math.ceil(filteredAlbums.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDisplayItems = filteredAlbums.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(0);
    };

    if (loading) return <p>⏳ Cargando álbumes...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="profile-albums-page">
            <h1 className="profile-albums-title">Mis Álbumes</h1>
            
            <div className="profile-albums-section">
                <div className="profile-albums-container">
                    <div className="profile-albums-tabs-container">
                        <button
                            className={`profile-albums-tab ${filter === 'todos' ? 'active' : ''}`}
                            onClick={() => handleTabChange('todos')}
                        >
                            Todos
                        </button>
                        <button
                            className={`profile-albums-tab ${filter === 'to_value' ? 'active' : ''}`}
                            onClick={() => handleTabChange('to_value')}
                        >
                            Por valorar
                        </button>
                        <button
                            className={`profile-albums-tab ${filter === 'valued' ? 'active' : ''}`}
                            onClick={() => handleTabChange('valued')}
                        >
                            Valorados
                        </button>
                    </div>
                    
                    <div className="profile-albums-content">
                        {currentDisplayItems.length === 0 ? (
                            <p className="profile-albums-empty-message">
                                No hay álbumes en esta categoría.
                            </p>
                        ) : (
                            <div className="profile-albums-grid">
                                {currentDisplayItems.map((album, index) => (
                                    <div key={index} className="profile-albums-result-item">
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
                    
                    {currentDisplayItems.length > 0 && totalPages > 1 && (
                        <div className="profile-albums-footer">
                            <button className="profile-albums-carousel-btn prev" onClick={handlePrevPage}>
                                <img src="src/assets/back.png" alt="Anterior" />
                            </button>
                            <button className="profile-albums-carousel-btn next" onClick={handleNextPage}>
                                <img src="src/assets/next.png" alt="Siguiente" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileAlbums;