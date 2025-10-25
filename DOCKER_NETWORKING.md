# Docker Networking Guide

This guide explains how to connect the Coach mobile app (frontend) to your Laravel backend when both are running in Docker containers.

## The Problem

When running both applications in Docker:
- Frontend container: `coach-app-frontend` (on `coach-app_default` network)
- Backend container: `coach-laravel.test-1` (on `coach_sail` network)

**They can't communicate because they're on different Docker networks!**

## The Solution

Connect the frontend container to the backend's Docker network (`coach_sail`).

### Current Configuration

Your `docker-compose.yml` is already configured to:

1. **Join the backend network:**
   ```yaml
   networks:
     - coach_sail
   ```

2. **Use the backend container hostname:**
   ```yaml
   environment:
     - EXPO_PUBLIC_API_URL=http://laravel.test/api
   ```

3. **Declare the external network:**
   ```yaml
   networks:
     coach_sail:
       external: true
   ```

## How It Works

### Container-to-Container Communication

When containers are on the same Docker network, they can reach each other using **container hostnames**:

```
Frontend Container (coach-app-frontend)
    ↓ http://laravel.test/api
Backend Container (laravel.test)
```

Docker's internal DNS resolves `laravel.test` to the backend container's IP address.

### Mobile Device/Simulator Access

Mobile devices and simulators access the backend through **exposed ports**:

```
Mobile Device/Simulator
    ↓ http://localhost/api (or 10.0.2.2 for Android)
Host Machine (port 80)
    ↓
Backend Container (laravel.test)
```

## Configuration Files

### 1. docker-compose.yml

```yaml
services:
  coach-app:
    container_name: coach-app-frontend
    environment:
      - EXPO_PUBLIC_API_URL=http://laravel.test/api
    networks:
      - coach_sail  # Join backend network

networks:
  coach_sail:
    external: true  # Use existing backend network
```

### 2. .env (for container)

```bash
# Container-to-container communication
EXPO_PUBLIC_API_URL=http://laravel.test/api
```

### 3. Mobile Device Configuration

When testing on actual devices, you need to use the host machine's IP:

**For iOS Simulator:**
```bash
EXPO_PUBLIC_API_URL=http://localhost/api
```

**For Android Emulator:**
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2/api
```

**For Physical Devices:**
```bash
# Replace with your computer's IP address
EXPO_PUBLIC_API_URL=http://192.168.1.100/api
```

## Verification

### 1. Check Networks

List all Docker networks:
```bash
docker network ls
```

You should see `coach_sail` in the list.

### 2. Check Container Network

Verify the frontend is on the correct network:
```bash
docker inspect coach-app-frontend --format='{{range .NetworkSettings.Networks}}{{.NetworkID}} {{end}}'
```

### 3. Test Connection

Test API connectivity from inside the container:
```bash
docker exec coach-app-frontend wget -qO- http://laravel.test/api/health
```

### 4. Run Reset Data Script

The reset-data script will test the connection:
```bash
npm run reset-data
```

## Troubleshooting

### "Connection Refused" or "Network Error"

**Problem:** Frontend can't reach backend

**Solutions:**

1. **Verify both containers are running:**
   ```bash
   docker ps | grep -E "coach|laravel"
   ```

2. **Check frontend is on backend network:**
   ```bash
   docker inspect coach-app-frontend | grep -A 5 Networks
   ```

3. **Restart frontend container:**
   ```bash
   docker-compose down && docker-compose up -d
   ```

4. **Test connection manually:**
   ```bash
   docker exec coach-app-frontend ping laravel.test
   ```

### "Could not resolve host: laravel.test"

**Problem:** DNS resolution not working

**Solutions:**

1. **Verify network configuration:**
   ```bash
   docker network inspect coach_sail
   ```

2. **Check backend container name:**
   ```bash
   docker ps --format "{{.Names}}" | grep laravel
   ```

3. **Ensure external network exists:**
   ```bash
   docker network ls | grep coach_sail
   ```

### Mobile App Can't Connect

**Problem:** App on device/simulator shows network errors

**Solutions:**

1. **For iOS Simulator - Use localhost:**
   - Backend port 80 is exposed to host
   - Use `http://localhost/api`

2. **For Android Emulator - Use special IP:**
   - Android emulator's localhost is the emulator itself
   - Use `http://10.0.2.2/api` to reach host machine

3. **For Physical Devices - Use computer's IP:**
   ```bash
   # Find your IP address
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Use in .env
   EXPO_PUBLIC_API_URL=http://192.168.1.100/api
   ```

4. **Check firewall:**
   - Make sure port 80 is not blocked
   - Device and computer must be on same WiFi network

### Changes to .env Not Taking Effect

**Problem:** Updated `.env` but app still uses old URL

**Solutions:**

1. **Restart Expo dev server:**
   ```bash
   # In the container logs, press Ctrl+C then:
   docker-compose restart
   ```

2. **Rebuild container:**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

3. **Clear Metro bundler cache:**
   ```bash
   docker exec coach-app-frontend npx expo start --clear
   ```

## Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Host Machine                   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │         coach_sail Network (Bridge)                │  │
│  │                                                     │  │
│  │  ┌──────────────────┐    ┌──────────────────┐    │  │
│  │  │  Frontend         │    │  Backend         │    │  │
│  │  │  coach-app-       │───▶│  laravel.test    │    │  │
│  │  │  frontend         │    │  (port 80)       │    │  │
│  │  └──────────────────┘    └──────────────────┘    │  │
│  │         │                         │               │  │
│  └─────────┼─────────────────────────┼───────────────┘  │
│            │                         │                   │
│            │ Exposed Ports           │ Exposed Ports     │
│            │ 8081, 19000-19002       │ 80                │
└────────────┼─────────────────────────┼───────────────────┘
             │                         │
             ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │ Expo Dev Tools  │      │ Mobile Devices  │
    │ localhost:19000 │      │ localhost:80    │
    └─────────────────┘      └─────────────────┘
```

## Best Practices

1. **Use container hostnames for internal communication**
   - `http://laravel.test/api` (not `http://localhost:80/api`)

2. **Use exposed ports for external access**
   - Mobile devices use `http://localhost/api` or computer IP

3. **Keep .env in .gitignore**
   - Different developers may need different configurations

4. **Document network dependencies**
   - Make it clear that frontend depends on backend network

5. **Test both scenarios**
   - Container-to-container (for API calls from Node.js)
   - Device-to-host (for mobile app testing)

## Quick Reference

### Start Everything

```bash
# Start backend (from backend directory)
./vendor/bin/sail up -d

# Start frontend (from frontend directory)
docker-compose up -d

# View logs
docker-compose logs -f
```

### Stop Everything

```bash
# Stop frontend
docker-compose down

# Stop backend (from backend directory)
./vendor/bin/sail down
```

### Restart Frontend

```bash
docker-compose restart
```

### View Logs

```bash
# Frontend logs
docker-compose logs -f

# Backend logs (from backend directory)
./vendor/bin/sail logs -f
```

## Summary

✅ **Frontend and backend are now on the same Docker network**  
✅ **Frontend uses `http://laravel.test/api` for API calls**  
✅ **Mobile devices use `http://localhost/api` (or appropriate IP)**  
✅ **Network communication is working correctly**

Your Docker networking is properly configured! The login should now work. 🎉
