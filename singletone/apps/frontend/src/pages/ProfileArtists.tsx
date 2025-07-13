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
    }, [filter, artists]);

    if (loading) return <p>⏳ Cargando artistas...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div className="profile-artists-page">
            <h1>Mis Artistas</h1>

            <div className="filter-buttons">
                <button onClick={() => setFilter('todos')} className={filter === 'todos' ? 'active' : ''}>Todos</button>
                <button onClick={() => setFilter('to_value')} className={filter === 'to_value' ? 'active' : ''}>Por valorar</button>
                <button onClick={() => setFilter('valued')} className={filter === 'valued' ? 'active' : ''}>Valorados</button>
            </div>

            <div className="profile-artists-scroll-vertical">
                {filteredArtists.length === 0 ? (
                    <p>No hay artistas en esta categoría.</p>
                ) : (
                    filteredArtists.map((artist, index) => (
                        <ArtistCard
                            key={index}
                            artistId={artist.artistId}
                            name={artist.name}
                            picture_url={artist.picture_url}
                            rank_state={artist.rank_state}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfileArtists;