# Dockerfile for Expo React Native Development
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Expo
RUN apk add --no-cache \
    git \
    bash \
    curl \
    openssh

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose ports for Expo development server
# 8081: Metro bundler
# 19000: Expo DevTools
# 19001: Expo DevTools (optional)
# 19002: Expo DevTools (optional)
EXPOSE 8081 19000 19001 19002

# Set environment variable to allow connections from any host
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Default command
CMD ["npm", "start"]
