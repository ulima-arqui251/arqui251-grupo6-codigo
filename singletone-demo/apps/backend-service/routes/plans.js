// routes/plans.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const PLANS_SERVICE_URL = process.env.PLANS_SERVICE_URL || 'http://plans-service:3006';

const proxyToPlansService = async (req, res) => {
  try {
    const config = {
      method: req.method,
      url: `${PLANS_SERVICE_URL}${req.originalUrl.replace('/api/plans', '/api')}`,
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
      res.status(500).json({ error: 'Service unavailable', message: 'Plans service is not responding' });
    }
  }
};

router.all('*', proxyToPlansService);
module.exports = router;
