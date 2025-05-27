const express = require('express');
const axios = require('axios');
const router = express.Router();

const MUSIC_SERVICE_URL = process.env.MUSIC_SERVICE_URL || 'http://music-service:3003';

// Middleware para proxy requests a music-service
const proxyToMusicService = async (req, res) => {
  try {
    const config = {
      method: req.method,
      url: `${MUSIC_SERVICE_URL}${req.originalUrl.replace('/api/music', '/api')}`,
      headers: {
        ...req.headers,
        host: undefined // Remover host header para evitar conflictos
      },
      timeout: 10000
    };

    if (req.body && Object.keys(req.body).length > 0) {
      config.data = req.body;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Service unavailable',
        message: 'Music service is not responding'
      });
    }
  }
};

// Rutas para música
router.get('/search', proxyToMusicService);
router.get('/artists', proxyToMusicService);
router.get('/artists/:id', proxyToMusicService);
router.get('/albums', proxyToMusicService);
router.get('/albums/:id', proxyToMusicService);
router.get('/songs', proxyToMusicService);
router.get('/songs/:id', proxyToMusicService);
router.get('/genres', proxyToMusicService);

// Crear rutas similares para los otros servicios
module.exports = router;