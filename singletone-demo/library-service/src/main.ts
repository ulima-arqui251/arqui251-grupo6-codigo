import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.LIBRARY_SERVICE_PORT || 3004;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'library-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestión de Biblioteca
app.get('/api/library/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ 
    message: 'Gestión de Biblioteca - Demo Ready',
    userId,
    library: {
      artists: [
        { id: 1, name: 'Queen', status: 'valorado', dateAdded: '2024-01-15' },
        { id: 2, name: 'The Beatles', status: 'agregado', dateAdded: '2024-01-20' }
      ],
      albums: [
        { id: 1, title: 'A Night at the Opera', artist: 'Queen', status: 'valorado', rating: 4.5 },
        { id: 2, title: 'Abbey Road', artist: 'The Beatles', status: 'agregado', rating: null }
      ]
    },
    stats: {
      totalArtists: 2,
      totalAlbums: 2,
      ratedAlbums: 1,
      averageRating: 4.5
    }
  });
});

app.post('/api/library/:userId/artists', (req, res) => {
  const { userId } = req.params;
  const { artistId } = req.body;
  res.json({
    message: 'Artista agregado a biblioteca (Demo)',
    userId,
    artistId,
    status: 'agregado'
  });
});

app.post('/api/library/:userId/albums/:albumId/rate', (req, res) => {
  const { userId, albumId } = req.params;
  const { rating } = req.body;
  res.json({
    message: 'Álbum valorado exitosamente (Demo)',
    userId,
    albumId,
    rating,
    canSave: true // Simulando que todas las canciones están valoradas
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Library Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});