import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.MUSIC_SERVICE_PORT || 3003;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'music-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Exploración Musical
app.get('/api/music/search', (req, res) => {
  const { q, type, limit = 10 } = req.query;
  res.json({ 
    message: 'Exploración Musical - Demo Ready',
    query: q,
    type: type || 'all',
    results: {
      artists: [
        { id: 1, name: 'Queen', genre: 'Rock', popularity: 95 },
        { id: 2, name: 'The Beatles', genre: 'Rock', popularity: 98 }
      ],
      albums: [
        { id: 1, title: 'A Night at the Opera', artist: 'Queen', year: 1975 },
        { id: 2, title: 'Abbey Road', artist: 'The Beatles', year: 1969 }
      ],
      songs: [
        { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
        { id: 2, title: 'Come Together', artist: 'The Beatles', album: 'Abbey Road' }
      ]
    },
    pagination: {
      page: 1,
      limit: parseInt(limit as string),
      total: 2
    }
  });
});

app.get('/api/music/autocomplete', (req, res) => {
  const { q } = req.query;
  res.json({
    suggestions: [
      `${q}ueen`,
      `${q}uiet Riot`,
      `${q}ueensrÿche`
    ].slice(0, 5)
  });
});

app.get('/api/music/genres', (req, res) => {
  res.json({
    genres: ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'Country', 'R&B']
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Music Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});