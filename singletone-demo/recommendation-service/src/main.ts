import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.RECOMMENDATION_SERVICE_PORT || 3005;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'recommendation-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestión de Recomendaciones
app.get('/api/recommendations/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ 
    message: 'Gestión de Recomendaciones - Demo Ready',
    userId,
    recommendations: {
      artists: [
        { 
          id: 3, 
          name: 'Led Zeppelin', 
          genre: 'Rock', 
          similarity: 0.87,
          reason: 'Basado en tu gusto por Queen'
        },
        { 
          id: 4, 
          name: 'Pink Floyd', 
          genre: 'Progressive Rock', 
          similarity: 0.82,
          reason: 'Fans de The Beatles también escuchan esto'
        }
      ],
      albums: [
        { 
          id: 3, 
          title: 'Led Zeppelin IV', 
          artist: 'Led Zeppelin', 
          similarity: 0.89,
          reason: 'Álbum similar a A Night at the Opera'
        },
        { 
          id: 4, 
          title: 'The Dark Side of the Moon', 
          artist: 'Pink Floyd', 
          similarity: 0.85,
          reason: 'Recomendado por usuarios similares'
        }
      ]
    },
    algorithm: 'hybrid',
    lastUpdated: new Date().toISOString()
  });
});

app.post('/api/recommendations/:userId/refresh', (req, res) => {
  const { userId } = req.params;
  res.json({
    message: 'Recomendaciones recalculadas exitosamente (Demo)',
    userId,
    status: 'refreshed',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/recommendations/:userId/feedback', (req, res) => {
  const { userId } = req.params;
  const { itemId, feedback } = req.body; // feedback: 'like' | 'dislike' | 'not_interested'
  res.json({
    message: 'Feedback de recomendación registrado (Demo)',
    userId,
    itemId,
    feedback
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});