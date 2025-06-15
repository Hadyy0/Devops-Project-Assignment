# Step-by-Step Guide to Completing the Docker Assignment

## Task 1: Design Your Application

1. **Define your application**
   - Choose the Weather Dashboard application
   - Create the `README.md` file describing the application
   - Design the architecture with three services: Frontend, Backend API, and Redis Cache

2. **Create the repository structure**
   ```bash
   mkdir -p weather-dashboard/{frontend,backend,monitoring}
   cd weather-dashboard
   git init
   ```

## Task 2: Implement the Services

1. **Backend API Service**
   - Create backend files:
     ```bash
     cd backend
     npm init -y
     # Add dependencies to package.json
     mkdir -p src logs
     # Create src/index.js, healthcheck.js
     ```

2. **Frontend Service**
   - Create frontend files:
     ```bash
     cd ../frontend
     npm init -y
     # Add dependencies to package.json
     mkdir -p src/components public
     # Create React components and configuration
     ```

3. **Create Dockerfiles**
   - Create `Dockerfile` in each service directory
   - Implement multi-stage builds for optimized images
   - Add HEALTHCHECK to the backend Dockerfile

4. **Monitoring Service**
   - Create monitoring files:
     ```bash
     cd ../monitoring
     npm init -y
     # Create monitor.js for health checking and auto-recovery
     ```

## Task 3: Containerize and Run

1. **Create a Docker network**
   ```bash
   docker network create weather-app-network
   ```

2. **Build Docker images**
   ```bash
   cd ..
   docker build -t backend-service ./backend
   docker build -t frontend-service ./frontend
   docker build -t monitoring-service ./monitoring
   ```

3. **Run Redis with volume**
   ```bash
   docker volume create redis-data
   docker run -d --name redis-cache --network weather-app-network -v redis-data:/data redis:alpine
   ```

4. **Run the backend**
   ```bash
   docker run -d --name backend-container --network weather-app-network -p 5000:5000 --env-file ./backend/.env backend-service
   ```

5. **Run the frontend**
   ```bash
   docker run -d --name frontend-container --network weather-app-network -p 3000:3000 frontend-service
   ```

6. **Run the monitoring service**
   ```bash
   docker run -d --name monitoring-container --network weather-app-network -v /var/run/docker.sock:/var/run/docker.sock monitoring-service
   ```

7. **Verify containers are running**
   ```bash
   docker ps
   ```

## Task 4: Deployment to Docker Hub

1. **Tag your images**
   ```bash
   docker tag backend-service yourdockerhubusername/backend-service:v1
   docker tag frontend-service yourdockerhubusername/frontend-service:v1
   ```

2. **Login to Docker Hub**
   ```bash
   docker login
   ```

3. **Push images**
   ```bash
   docker push yourdockerhubusername/backend-service:v1
   docker push yourdockerhubusername/frontend-service:v1
   ```

## Task 5: Test the Creative Enhancement

1. **View health logs**
   ```bash
   docker exec backend-container cat /app/logs/health.log
   ```

2. **Simulate a failure**
   ```bash
   docker exec backend-container kill -9 1
   ```

3. **Observe auto-recovery**
   ```bash
   docker ps
   # The container should restart automatically
   ```

## Task 6: Write Reflection

1. **Create reflection.txt**
   - Write about the inspiration, challenges, Docker features, and potential improvements
   - Save the file in the root directory

## Final Submission

1. **Take screenshots**
   ```bash
   mkdir screenshots
   # Take screenshots of the application and Docker logs
   ```

2. **Commit changes**
   ```bash
   git add .
   git commit -m "Complete Docker microservices assignment"
   ```

3. **Push to GitHub**
   ```bash
   # Create a new GitHub repository
   git remote add origin https://github.com/yourusername/weather-dashboard.git
   git push -u origin main
   ```

4. **Submit the GitHub repository URL**