const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

// Proxy al user-service para autenticación
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/login`, req.body, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Service unavailable',
        message: 'User service is not responding'
      });
    }
  }
});

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/register`, req.body, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Service unavailable',
        message: 'User service is not responding'
      });
    }
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;