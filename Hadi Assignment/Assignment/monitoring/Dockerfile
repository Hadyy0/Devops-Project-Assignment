FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create logs directory
RUN mkdir -p logs

CMD ["node", "monitor.js"]