// src/pages/ProfileArtists.tsx
import { useEffect, useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import './ProfileArtists.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileArtists = () => {
    const [artists, setArtists] = useState<any[]>([]);
    const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
    const [filter, setFilter] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decoded?.userId;

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [userArtistsRes, allArtistsRes] = await Promise.all([
                    fetch(`${API_URL}/library/artists/${userId}`, { headers }),
                    fetch(`${API_URL}/music/artists`, { headers })
                ]);
                const userArtistLinks = await userArtistsRes.json();
                const allArtists = await allArtistsRes.json();
                const artistMap = Object.fromEntries(allArtists.map((a: any) => [a._id, a]));
                const enriched = userArtistLinks.map((ua: any) => {
                    const artist = artistMap[ua.artist_id];
                    if (!artist) return null;
                    return {
                        artistId: ua.artist_id,
                        name: artist.name,
                        picture_url: artist.picture_url,
                        rank_state: ua.rank_state
                    };
                }).filter(Boolean);
                setArtists(enriched);
                setFilteredArtists(enriched);
            } catch (err: any) {
                setError('Error al cargar artistas');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtists();
    }, []);

    useEffect(() => {
        if (filter === 'todos') {
            setFilteredArtists(artists);
        } else {
            setFilteredArtists(artists.filter((a: any) => a.rank_state === filter));
        }
        setCurrentPage(0); // Reset page when filter changes
    }, [filter, artists]);

    const itemsPerPage = 24;
    const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDisplayItems = filteredArtists.slice(startIndex, endIndex);

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

    if (loading) return <p>⏳ Cargando artistas...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="profile-artists-page">
            <h1 className="profile-artists-title">Mis Artistas</h1>
            
            <div className="profile-artists-section">
                <div className="profile-artists-container">
                    <div className="profile-artists-tabs-container">
                        <button
                            className={`profile-artists-tab ${filter === 'todos' ? 'active' : ''}`}
                            onClick={() => handleTabChange('todos')}
                        >
                            Todos
                        </button>
                        <button
                            className={`profile-artists-tab ${filter === 'to_value' ? 'active' : ''}`}
                            onClick={() => handleTabChange('to_value')}
                        >
                            Por valorar
                        </button>
                        <button
                            className={`profile-artists-tab ${filter === 'valued' ? 'active' : ''}`}
                            onClick={() => handleTabChange('valued')}
                        >
                            Valorados
                        </button>
                    </div>
                    
                    <div className="profile-artists-content">
                        {currentDisplayItems.length === 0 ? (
                            <p className="profile-artists-empty-message">
                                No hay artistas en esta categoría.
                            </p>
                        ) : (
                            <div className="profile-artists-grid">
                                {currentDisplayItems.map((artist, index) => (
                                    <div key={index} className="profile-artists-result-item">
                                        <ArtistCard
                                            artistId={artist.artistId}
                                            name={artist.name}
                                            picture_url={artist.picture_url}
                                            rank_state={artist.rank_state}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {currentDisplayItems.length > 0 && totalPages > 1 && (
                        <div className="profile-artists-footer">
                            <button className="profile-artists-carousel-btn prev" onClick={handlePrevPage}>
                                <img src="src/assets/back.png" alt="Anterior" />
                            </button>
                            <button className="profile-artists-carousel-btn next" onClick={handleNextPage}>
                                <img src="src/assets/next.png" alt="Siguiente" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileArtists;