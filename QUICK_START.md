# Quick Start Guide

## 🚀 Get Up and Running in 3 Steps

### 1. Start Backend (Laravel)

```bash
cd /path/to/backend
./vendor/bin/sail up -d
```

### 2. Start Frontend (React Native)

```bash
cd /path/to/coach-app
docker-compose up -d
```

### 3. Open the App

```bash
# View QR code and dev tools
docker logs coach-app-frontend

# Or visit: http://localhost:19000
```

Then scan the QR code with:
- **iOS:** Camera app
- **Android:** Expo Go app

## 🔑 Test Credentials

```
Email:    test@test.com
Password: 11111111
```

## 🛠️ Useful Commands

### Check Connection

```bash
npm run test-connection
```

This will verify:
- ✓ Frontend container is running
- ✓ Backend container is running
- ✓ Network connectivity works
- ✓ API endpoint is reachable

### Create Test User

```bash
npm run reset-data
```

### View Logs

```bash
# Frontend logs
docker logs -f coach-app-frontend

# Backend logs
docker logs -f coach-laravel.test-1
```

### Restart Services

```bash
# Restart frontend
docker-compose restart

# Restart backend
cd /path/to/backend && ./vendor/bin/sail restart
```

### Stop Everything

```bash
# Stop frontend
docker-compose down

# Stop backend
cd /path/to/backend && ./vendor/bin/sail down
```

## 📱 Mobile Device Configuration

### iOS Simulator
- Uses: `http://localhost/api`
- No special configuration needed

### Android Emulator
- Uses: `http://10.0.2.2/api`
- Update `.env` if needed

### Physical Devices
- Uses: `http://YOUR_COMPUTER_IP/api`
- Find your IP: `ifconfig | grep "inet "`
- Update `.env` with your IP
- Ensure device and computer are on same WiFi

## 🐛 Troubleshooting

### Login Doesn't Work

1. **Check containers are running:**
   ```bash
   docker ps | grep -E "coach|laravel"
   ```

2. **Test connection:**
   ```bash
   npm run test-connection
   ```

3. **Check backend logs:**
   ```bash
   docker logs coach-laravel.test-1 | tail -50
   ```

4. **Verify API URL:**
   ```bash
   docker exec coach-app-frontend printenv EXPO_PUBLIC_API_URL
   ```
   Should show: `http://laravel.test/api`

### Can't Connect to Backend

1. **Verify network configuration:**
   ```bash
   docker inspect coach-app-frontend | grep -A 5 Networks
   ```
   Should show: `coach_sail`

2. **Test ping:**
   ```bash
   docker exec coach-app-frontend ping -c 3 laravel.test
   ```

3. **Restart frontend:**
   ```bash
   docker-compose down && docker-compose up -d
   ```

### Changes Not Appearing

1. **Clear Metro cache:**
   ```bash
   docker exec coach-app-frontend npx expo start --clear
   ```

2. **Rebuild container:**
   ```bash
   docker-compose up --build -d
   ```

3. **Reload app:**
   - Shake device
   - Press `r` in terminal
   - Or press "Reload" in Expo Go menu

## 📚 Documentation

- [DOCKER_NETWORKING.md](./DOCKER_NETWORKING.md) - Detailed networking guide
- [API_SETUP.md](./API_SETUP.md) - API configuration
- [README.md](./README.md) - Full project documentation

## ✅ Verification Checklist

Before testing the app:

- [ ] Backend container is running (`docker ps`)
- [ ] Frontend container is running (`docker ps`)
- [ ] Connection test passes (`npm run test-connection`)
- [ ] Test user exists (run `npm run reset-data`)
- [ ] Expo dev server is running (check logs)
- [ ] QR code is visible

## 🎯 Common Tasks

### Add New User
```bash
npm run reset-data
```

### View API Requests
Check backend logs while using the app:
```bash
docker logs -f coach-laravel.test-1
```

### Debug Frontend
```bash
# View frontend logs
docker logs -f coach-app-frontend

# Open debugger
# Press 'j' in the Expo terminal
```

### Update Dependencies
```bash
# Stop container
docker-compose down

# Update packages
npm install

# Rebuild and start
docker-compose up --build -d
```

## 🔄 Development Workflow

1. **Start both services** (backend + frontend)
2. **Run connection test** to verify setup
3. **Open app** on device/simulator
4. **Make changes** to code (hot reload enabled)
5. **Check logs** if something breaks
6. **Restart services** if needed

## 💡 Pro Tips

1. **Keep both terminals open** - one for backend logs, one for frontend
2. **Use `npm run test-connection`** before debugging connection issues
3. **Check backend logs first** when API calls fail
4. **Clear Metro cache** if you see weird errors
5. **Restart containers** after changing `.env` or `docker-compose.yml`

## 🆘 Need Help?

1. Run connection test: `npm run test-connection`
2. Check logs: `docker logs coach-app-frontend`
3. Verify backend: `docker logs coach-laravel.test-1`
4. Read [DOCKER_NETWORKING.md](./DOCKER_NETWORKING.md)

---

**Everything working?** Start building! 🎉
