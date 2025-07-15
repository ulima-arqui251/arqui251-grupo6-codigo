import { useEffect, useState } from 'react';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import './Search.css';

const API_URL = import.meta.env.VITE_API_URL;

const Search = () => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'albums' | 'artists'>('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [albums, setAlbums] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);
    const [filteredAlbums, setFilteredAlbums] = useState<any[]>([]);
    const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [albumRes, artistRes] = await Promise.all([
            fetch(`${API_URL}/music/albums`, { headers }),
            fetch(`${API_URL}/music/artists`, { headers })
            ]);
            const [albumData, artistData] = await Promise.all([
            albumRes.json(),
            artistRes.json()
            ]);
            setAlbums(albumData);
            setArtists(artistData);
        } catch (err) {
            console.error('Error al cargar data de búsqueda:', err);
        } finally {
            setLoading(false);
        }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const q = query.toLowerCase();
        setFilteredAlbums(
        activeTab !== 'artists'
            ? albums.filter((a) => a.title.toLowerCase().includes(q))
            : []
        );
        setFilteredArtists(
        activeTab !== 'albums'
            ? artists.filter((a) => a.name.toLowerCase().includes(q))
            : []
        );
        setCurrentPage(0); // Reset page when search changes
    }, [query, activeTab, albums, artists]);

    const itemsPerPage = 24;
    const allItems = [...filteredArtists, ...filteredAlbums];
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDisplayItems = allItems.slice(startIndex, endIndex);

const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleTabChange = (tab: 'all' | 'albums' | 'artists') => {
    setActiveTab(tab);
    setCurrentPage(0);
};

    return (
        <div className="search-page">
        <h1 className="search-title">Búsqueda</h1>
        
        <div className="search-bar-container">
            <div className="search-input-wrapper">
            <input
                type="text"
                placeholder=""
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            <button className="search-button">
                <img src="src/assets/search_icon.png" alt="Buscar" />
            </button>
            </div>
        </div>

        <div className="results-section">
            <div className="results-container">
            <div className="tabs-container">
                <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => handleTabChange('all')}
                >
                Todos
                </button>
                <button
                className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
                onClick={() => handleTabChange('albums')}
                >
                Albums
                </button>
                <button
                className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
                onClick={() => handleTabChange('artists')}
                >
                Artista
                </button>
            </div>
            
            <div className="results-content">
                {loading ? (
                <p className="loading-message">⏳ Cargando catálogo musical...</p>
                ) : currentDisplayItems.length === 0 ? (
                <p className="empty-message">
                    No se encontraron resultados para "{query}"
                </p>
                ) : (
                <div className="results-grid">
                    {currentDisplayItems.map((item: any, index: number) => (
                    <div key={index} className="result-item">
                        {item.title ? (
                        <AlbumCard
                            albumId={item._id}
                            title={item.title}
                            cover_url={item.cover_url}
                            average_score="—"
                            rank_state=""
                        />
                        ) : (
                        <ArtistCard
                            artistId={item._id}
                            name={item.name}
                            picture_url={item.picture_url}
                        />
                        )}
                    </div>
                    ))}
                </div>
                )}
            </div>
            
            {!loading && currentDisplayItems.length > 0 && (
                <div className="results-footer">
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

export default Search;