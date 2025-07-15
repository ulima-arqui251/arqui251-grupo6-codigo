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
  const [activeTab, setActiveTab] = useState<'albums' | 'artists'>('albums');
  const [currentPage, setCurrentPage] = useState(0);
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

  const itemsPerPage = 12;
  const currentItems = activeTab === 'albums' ? summary?.albums || [] : summary?.artists || [];
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDisplayItems = currentItems.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleTabChange = (tab: 'albums' | 'artists') => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Mi perfil</h1>
        <div className="profile-picture-container">
          <div className="profile-picture">
            <img src={profile.picture} alt="Foto de perfil" />
            <button className="edit-button-circle" onClick={() => navigate('/edit_profile')}>
              <div className="edit-icon">
                <img src="src/assets/edit.png" alt="edit" />
              </div>
            </button>
          </div>
        </div>
        <h2 className="profile-nickname">@{profile.nickname}</h2>
        {profile.subscriptionType === 'premium' ? (
          <p className="subscription-text">Suscriptor: Premium</p>
        ) : (
          <p className="subscription-text">
            {summary?.remainingRatings ?? '--'} valoraciones restantes{' '}
            <a href="/landing_page_01" className="premium-link">¡Vuélvete premium!</a>
          </p>
        )}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-label">N° Artistas</div>
            <div className="stat-number light">{summary.artistCount}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">N° Albums</div>
            <div className="stat-number dark">{summary.albumCount}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">N° Canciones</div>
            <div className="stat-number light">{summary.songCount}</div>
          </div>
        </div>
      </div>

      <div className="library-section">
        <div className="library-container">
          <div className="tabs-container">
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
              Artistas
            </button>
          </div>
          
          <div className="library-content">
            {currentDisplayItems.length === 0 ? (
              <p className="empty-message">
                Sin {activeTab === 'albums' ? 'albums' : 'artistas'} agregados
              </p>
            ) : (
              <div className="carousel-grid">
                {currentDisplayItems.map((item: any, index: number) => (
                  <div key={index} className="carousel-item">
                    {activeTab === 'albums' ? (
                      <AlbumCard
                        albumId={item.albumId}
                        title={item.title}
                        cover_url={item.cover_url}
                        average_score={item.average_score}
                        rank_state={item.rank_state}
                      />
                    ) : (
                      <ArtistCard
                        artistId={item.artistId}
                        name={item.name}
                        picture_url={item.picture_url}
                        rank_state={item.rank_state}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
            <div className="library-footer">
                <button className="carousel-btn prev" onClick={handlePrevPage}>
                    {/* Aquí pondrás tu icono de retroceder */}
                    <img src="src/assets/back.png" alt="Anterior" />
                </button>
                <button className="carousel-btn next" onClick={handleNextPage}>
                    {/* Aquí pondrás tu icono de avanzar */}
                    <img src="src/assets/next.png" alt="Siguiente" />
                </button>
            </div>
        </div>
        
        <div className="see-all-link">
          <a href={activeTab === 'albums' ? '/profile_albums' : '/profile_artists'}>
            Ver todos
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;