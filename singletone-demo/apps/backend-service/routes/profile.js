// routes/profile.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'http://profile-service:3002';

const proxyToProfileService = async (req, res) => {
  try {
    const config = {
      method: req.method,
      url: `${PROFILE_SERVICE_URL}${req.originalUrl.replace('/api/profile', '/api')}`,
      headers: { ...req.headers, host: undefined },
      timeout: 10000
    };
    if (req.body && Object.keys(req.body).length > 0) config.data = req.body;
    
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Service unavailable', message: 'Profile service is not responding' });
    }
  }
};

router.all('*', proxyToProfileService);
module.exports = router;