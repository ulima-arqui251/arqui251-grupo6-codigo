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
        <div className="artist-card" onClick={handleClick}>
            <img src={picture_url} alt={name} />
            <p>{name}</p>
        </div>
    );
};

export default ArtistCard;