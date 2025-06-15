# Weather Dashboard Microservices Application

## Description
This Weather Dashboard is a microservices-based application that displays real-time weather data. It consists of three services:

1. **Backend API Service**: A Node.js/Express service that fetches data from OpenWeatherMap API and provides endpoints for the frontend.
2. **Frontend Service**: A React application that displays weather information in a user-friendly interface.
3. **Redis Cache Service**: Stores frequently requested weather data to reduce API calls and improve response times.

## Architecture Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│   Backend API   │────▶│   Redis Cache   │
│   (React)       │     │   (Node.js)     │     │                 │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │  OpenWeatherMap │
                        │  External API   │
                        └─────────────────┘
```

## Tech Stack
- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Node.js, Express
- **Cache**: Redis
- **Containerization**: Docker

## Docker Implementation
- Custom Docker network for service communication
- Docker volumes for Redis data persistence
- Multi-stage builds for optimized image sizes
- Health checks for monitoring service status

## Setup Instructions

### Prerequisites
- Docker Desktop installed
- OpenWeatherMap API key (get one for free at https://openweathermap.org/api)
- Docker Hub account

### Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

### Step 2: Set your OpenWeatherMap API key
Create a `.env` file in the backend directory:
```bash
echo "OPENWEATHERMAP_API_KEY=your_api_key_here" > backend/.env
```

### Step 3: Create a Docker network
```bash
docker network create weather-app-network
```

### Step 4: Build the Docker images
```bash
docker build -t backend-service ./backend
docker build -t frontend-service ./frontend
```

### Step 5: Run Redis with a volume for persistence
```bash
docker volume create redis-data
docker run -d --name redis-cache --network weather-app-network -v redis-data:/data redis:alpine
```

### Step 6: Run the backend service
```bash
docker run -d --name backend-container --network weather-app-network -p 5000:5000 --env-file ./backend/.env backend-service
```

### Step 7: Run the frontend service
```bash
docker run -d --name frontend-container --network weather-app-network -p 3000:3000 frontend-service
```

### Step 8: Access the application
Open your browser and go to `http://localhost:3000`

### Step 9: Push images to Docker Hub
```bash
# Tag images
docker tag backend-service yourdockerhubusername/backend-service:v1
docker tag frontend-service yourdockerhubusername/frontend-service:v1

# Login to Docker Hub
docker login

# Push images
docker push yourdockerhubusername/backend-service:v1
docker push yourdockerhubusername/frontend-service:v1
```

## Creative Enhancement: Health Check and Auto-Recovery

This application includes a custom health monitoring system that:

1. Implements Docker HEALTHCHECK in the backend Dockerfile to monitor API service health
2. Uses a shared volume between backend and frontend to log health status
3. Includes a monitoring script that automatically restarts unhealthy services

To see this in action:
```bash
# View health status logs
docker exec backend-container cat /app/logs/health.log

# Simulate a backend failure
docker exec backend-container kill -9 1

# Observe automatic recovery
docker ps
```

## Screenshots

![Weather Dashboard Screenshot](screenshots/dashboard.png)
*Weather Dashboard showing current conditions*

![Container Logs](screenshots/container-logs.png)
*Docker container logs showing service communication*

## Docker Hub Repository
- Backend Service: [Docker Hub Link](https://hub.docker.com/yourdockerhubusername/backend-service)
- Frontend Service: [Docker Hub Link](https://hub.docker.com/yourdockerhubusername/frontend-service)