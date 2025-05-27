const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');
const musicRoutes = require('./routes/music');
const libraryRoutes = require('./routes/library');
const recommendationRoutes = require('./routes/recommendations');
const planRoutes = require('./routes/plans');
const profileRoutes = require('./routes/profile');

// Middleware de autenticación
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP cada 15 minutos
});

// Middlewares globales
app.use(helmet()); // Seguridad
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(compression()); // Compresión gzip
app.use(morgan('combined')); // Logging
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas públicas
app.use('/api/health', healthRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/auth', userRoutes);
app.use('/api/music', authMiddleware, musicRoutes);
app.use('/api/library', authMiddleware, libraryRoutes);
app.use('/api/recommendations', authMiddleware, recommendationRoutes);
app.use('/api/plans', authMiddleware, planRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🎵 Singletone Backend API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      music: '/api/music',
      library: '/api/library',
      recommendations: '/api/recommendations',
      plans: '/api/plans',
      profile: '/api/profile'
    },
    documentation: '/api/docs'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/health',
      '/api/auth',
      '/api/music',
      '/api/library',
      '/api/recommendations',
      '/api/plans',
      '/api/profile'
    ]
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Singletone Backend Service running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;