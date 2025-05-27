const express = require('express');
const router = express.Router();

// Health check básico
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Singletone Backend Service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Health check detallado
router.get('/detailed', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      database: 'checking...',
      redis: 'checking...',
      microservices: 'checking...'
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }
  };

  try {
    // Aquí puedes agregar checks específicos para bases de datos
    // Por ahora simulamos que están funcionando
    healthStatus.services.database = 'healthy';
    healthStatus.services.redis = 'healthy';
    healthStatus.services.microservices = 'healthy';

    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.status = 'ERROR';
    healthStatus.error = error.message;
    res.status(500).json(healthStatus);
  }
});

// Readiness probe (para Kubernetes)
router.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Liveness probe (para Kubernetes)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;