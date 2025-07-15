// src/components/ArtistCard.tsx
import './ArtistCard.css';
import { useNavigate, useLocation } from 'react-router-dom';

interface ArtistCardProps {
    artistId: string;
    name: string;
    picture_url: string;
    rank_state?: string;
}

const ArtistCard = ({ artistId, name, picture_url, rank_state }: ArtistCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isFromProfile = location.pathname.includes('/profile');

    const handleClick = () => {
        if (isFromProfile) {
        navigate(`/my-artist/${artistId}`);
        } else {
        navigate(`/artist/${artistId}`, {
            state: { rank_state: rank_state ?? '' }
        });
        }
    };

    return (
        <div className="artist-card-wrapper">
        <div className="artist-card" onClick={handleClick}>
            <div className="artist-card-top">
            <div className="artist-card-circle"></div>
            <div className="artist-card-mic-icon">
                <img
                src="src/assets/microph.png"
                alt="Microphone"
                className="mic-icon-image"
                />
            </div>
            <img src={picture_url} alt={name} className="artist-card-image" />
            </div>
            <div className="artist-card-bottom">
            <p className="artist-card-title">{name}</p>
            </div>
        </div>
        </div>
    );
};

export default ArtistCard;