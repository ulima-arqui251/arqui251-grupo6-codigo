import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PROFILE_SERVICE_PORT || 3002;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'profile-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Visualización de Perfil
app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ 
    message: 'Visualización de Perfil - Demo Ready',
    userId,
    profile: {
      basic: {
        name: 'Usuario Demo',
        email: 'demo@singletone.com',
        joinDate: '2024-01-01'
      },
      statistics: {
        songsRated: 45,
        artistsFollowed: 12,
        averageRating: 4.2
      },
      music: {
        favoriteGenres: ['Rock', 'Pop', 'Jazz'],
        recentActivity: ['Valoró "Bohemian Rhapsody"', 'Siguió a "Queen"']
      },
      premium: {
        isPremium: false,
        plan: 'free'
      }
    }
  });
});

app.put('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ 
    message: 'Perfil actualizado exitosamente (Demo)',
    userId,
    updatedFields: Object.keys(req.body)
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Profile Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});