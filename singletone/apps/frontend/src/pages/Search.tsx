import { useEffect, useState } from 'react';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import './Search.css';

const API_URL = import.meta.env.VITE_API_URL;

const Search = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'albums' | 'artists'>('all');
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
      filter !== 'artists'
        ? albums.filter((a) => a.title.toLowerCase().includes(q))
        : []
    );
    setFilteredArtists(
      filter !== 'albums'
        ? artists.filter((a) => a.name.toLowerCase().includes(q))
        : []
    );
  }, [query, filter, albums, artists]);

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
            <img src="src/assets/search_icon.png" alt="search-button" />
          </button>
        </div>
      </div>

      <div className="search-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="all">Todos</option>
          <option value="albums">Solo álbumes</option>
          <option value="artists">Solo artistas</option>
        </select>
      </div>

      {loading ? (
        <p>⏳ Cargando catálogo musical...</p>
      ) : (
        <div className="results-grid">
          {filteredArtists.map((artist) => (
            <ArtistCard
              key={artist._id}
              artistId={artist._id}
              name={artist.name}
              picture_url={artist.picture_url}
            />
          ))}
          {filteredAlbums.map((album) => (
            <AlbumCard
              key={album._id}
              albumId={album._id}
              title={album.title}
              cover_url={album.cover_url}
              average_score="—"
              rank_state=""
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;