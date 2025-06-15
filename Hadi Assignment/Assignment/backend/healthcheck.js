const http = require('http');
const fs = require('fs');
const path = require('path');

const options = {
  host: 'localhost',
  port: 5000,
  path: '/health',
  timeout: 2000
};

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', (err) => {
  // Log the error to health.log
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - healthcheck-failed: ${err.message}\n`;
  
  try {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(path.join(logsDir, 'health.log'), logEntry);
  } catch (fsErr) {
    console.error('Failed to write to health log:', fsErr);
  }
  
  process.exit(1);
});

healthCheck.end();