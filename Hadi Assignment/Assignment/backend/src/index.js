require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize Redis client
const redisClient = redis.createClient({
  url: 'redis://redis-cache:6379'
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

// Redis error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  logHealthStatus('redis-connection-error');
});

// Log health status to file
const logHealthStatus = (status) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${status}\n`;
  fs.appendFile(path.join(logsDir, 'health.log'), logEntry, (err) => {
    if (err) {
      console.error('Error writing to health log:', err);
    }
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  logHealthStatus('health-check-ok');
  res.status(200).json({ status: 'ok' });
});

// Get weather by city
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    // Check if data is in cache
    const cachedData = await redisClient.get(`weather:${city}`);
    
    if (cachedData) {
      console.log(`Serving cached data for ${city}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // If not in cache, fetch from API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    // Store in cache for 10 minutes
    await redisClient.setEx(
      `weather:${city}`, 
      600, 
      JSON.stringify(response.data)
    );
    
    logHealthStatus('api-request-success');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    logHealthStatus('api-request-error');
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get forecast by city
app.get('/api/forecast/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    // Check if data is in cache
    const cachedData = await redisClient.get(`forecast:${city}`);
    
    if (cachedData) {
      console.log(`Serving cached forecast for ${city}`);
      return res.json(JSON.parse(cachedData));
    }
    
    // If not in cache, fetch from API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    // Store in cache for 30 minutes
    await redisClient.setEx(
      `forecast:${city}`, 
      1800, 
      JSON.stringify(response.data)
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logHealthStatus('server-started');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});