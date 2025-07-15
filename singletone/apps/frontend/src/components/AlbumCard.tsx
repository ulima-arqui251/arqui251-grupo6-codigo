// src/components/AlbumCard.tsx
import { useNavigate } from 'react-router-dom';
import './AlbumCard.css'; // Asegúrate de importar el CSS

interface AlbumCardProps {
  albumId: string;
  title: string;
  cover_url: string;
  average_score: string;
  rank_state?: 'valued' | 'to_value' | string;
}

const AlbumCard = ({ albumId, title, cover_url, average_score, rank_state }: AlbumCardProps) => {
  const navigate = useNavigate();
  const showScore = rank_state === 'valued' ? average_score : '—';

  return (
    <div
      className="album-card"
      onClick={() => navigate(`/album/${albumId}`)}
    >
      <div className="album-card-top">
        <div className="album-card-circle"></div>
        <img
          src={cover_url}
          alt={title}
          className="album-card-image"
        />
      </div>
      
      <div className="album-card-bottom">
        <h3 className="album-card-title">{title}</h3>
        <div className="album-card-score-container">
          <div className="album-card-score-bg"></div>
          <p className="album-card-score">{showScore}</p>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;