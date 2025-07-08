import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlbumCard from '../components/AlbumCard';
import ArtistCard from '../components/ArtistCard';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileAndSummary = async () => {
            try {
                const decoded = JSON.parse(atob(token!.split('.')[1]));
                const userId = decoded.userId;

                const [profileRes, summaryRes] = await Promise.all([
                    fetch(`${API_URL}/profiles/by-user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/library/summary/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const profileData = await profileRes.json();
                const summaryData = await summaryRes.json();

                if (!profileRes.ok) throw new Error(profileData.message || 'Error al cargar perfil');
                if (!summaryRes.ok) throw new Error(summaryData.message || 'Error al cargar resumen');

                setProfile(profileData);
                setSummary(summaryData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileAndSummary();
        else {
            setError('Token no encontrado');
            setLoading(false);
        }
    }, [token]);

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="profile-container">
            <h1>Mi Perfil</h1>

            <div className="profile-picture">
                <img src={profile.picture} alt="Foto de perfil" />
            </div>

            <h2>@{profile.nickname}</h2>

            {profile.subscriptionType === 'premium' ? (
                <p>Suscriptor: Premium</p>
            ) : (
                <p>
                    Valoraciones restantes: {summary?.remainingRatings ?? '--'}{' '}
                    <a href="/landing_page_01">¡Vuelve premium!</a>
                </p>
            )}

            <div className="profile-stats">
                <div><h3>N° Artistas</h3><p>{summary.artistCount}</p></div>
                <div><h3>N° Albums</h3><p>{summary.albumCount}</p></div>
                <div><h3>N° Canciones</h3><p>{summary.songCount}</p></div>
            </div>

            <div className="profile-section">
                <h2>Albums Agregados</h2>
                {summary.albums.length === 0 ? (
                    <p>Sin albums agregados</p>
                ) : (
                    <div className="profile-albums-scroll">
                        {summary.albums.map((album: any, index: number) => (
                            <AlbumCard
                                key={index}
                                albumId={album.albumId}
                                title={album.title}
                                cover_url={album.cover_url}
                                average_score={album.average_score}
                                rank_state={album.rank_state}
                            />
                        ))}
                    </div>
                )}
                <a href="/profile_albums">Ver más</a>
            </div>

            <div className="profile-section">
                <h2>Artistas Agregados</h2>
                {summary.artists.length === 0 ? (
                    <p>Sin artistas agregados</p>
                ) : (
                    <div className="profile-artists-scroll">
                        {summary.artists.map((artist: any, index: number) => (
                            <ArtistCard
                                key={index}
                                artistId={artist.artistId}
                                name={artist.name}
                                picture_url={artist.picture_url}
                                rank_state={artist.rank_state}
                            />
                        ))}
                    </div>
                )}
                <a href="/profile_artists">Ver más</a>
            </div>
        </div>
    );
};

export default Profile;