const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');

// Configuration
const BACKEND_HEALTH_URL = 'http://backend-container:5000/health';
const CHECK_INTERVAL = 60000; // 1 minute
const HEALTH_LOG_PATH = '/app/logs/health.log';

// Function to check backend health
async function checkBackendHealth() {
  try {
    const response = await axios.get(BACKEND_HEALTH_URL, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error(`Health check failed: ${error.message}`);
    return false;
  }
}

// Function to restart a container
function restartContainer(containerName) {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to restart ${containerName}...`);
    
    exec(`docker restart ${containerName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restarting container: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(`Container ${containerName} restarted successfully`);
      resolve(stdout);
    });
  });
}

// Function to log health status
function logHealthStatus(status) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - MONITOR: ${status}\n`;
  
  fs.appendFile(HEALTH_LOG_PATH, logEntry, (err) => {
    if (err) {
      console.error(`Error writing to log: ${err.message}`);
    }
  });
}

// Main monitoring function
async function monitor() {
  console.log('Starting health monitoring service...');
  
  setInterval(async () => {
    try {
      const isBackendHealthy = await checkBackendHealth();
      
      if (!isBackendHealthy) {
        logHealthStatus('backend-unhealthy');
        console.log('Backend service is unhealthy, restarting...');
        
        try {
          await restartContainer('backend-container');
          logHealthStatus('backend-restarted');
        } catch (restartError) {
          logHealthStatus(`backend-restart-failed: ${restartError.message}`);
        }
      } else {
        // Log healthy status occasionally (every 10 checks)
        if (Math.random() < 0.1) {
          logHealthStatus('all-services-healthy');
        }
      }
    } catch (error) {
      console.error(`Monitoring error: ${error.message}`);
      logHealthStatus(`monitoring-error: ${error.message}`);
    }
  }, CHECK_INTERVAL);
}

// Start monitoring
monitor();