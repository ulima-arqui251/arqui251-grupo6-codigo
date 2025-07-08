// src/components/AlbumCard.tsx
import { useNavigate } from 'react-router-dom';

interface AlbumCardProps {
    albumId: string;
    title: string;
    cover_url: string;
    average_score: number | string;
    rank_state?: 'valued' | 'to_value' | string;
}

const AlbumCard = ({ albumId, title, cover_url, average_score, rank_state }: AlbumCardProps) => {
    const navigate = useNavigate();

    const showScore = rank_state === 'valued' ? average_score : '—';

    return (
        <div
            className="album-card"
            onClick={() => navigate(`/album/${albumId}`)}
            style={{
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                width: '160px'
            }}
        >
            <img
                src={cover_url}
                alt={title}
                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <h3 style={{ fontSize: '16px', margin: '8px 0 4px' }}>{title}</h3>
            <p style={{ fontWeight: 'bold' }}>Nota: {showScore}</p>
        </div>
    );
};

export default AlbumCard;
