# Docker Setup Guide - Coach App Frontend

This guide will help you set up the Coach App frontend development environment using Docker.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Docker Desktop** (for Mac/Windows) or **Docker Engine** (for Linux)
  - Download from: https://docs.docker.com/get-docker/
  - Version: 20.10 or higher
- **Docker Compose**
  - Usually included with Docker Desktop
  - For Linux: https://docs.docker.com/compose/install/

To verify your installation:
```bash
docker --version
docker-compose --version
```

## Quick Start

### Using the Setup Script (Recommended)

We provide a convenient setup script that handles all common operations:

1. **Build the Docker image:**
   ```bash
   ./start.sh build
   ```

2. **Start the development server:**
   ```bash
   ./start.sh start
   ```

3. **View logs:**
   ```bash
   ./start.sh logs
   ```

4. **Stop the development server:**
   ```bash
   ./start.sh stop
   ```

### Manual Setup

If you prefer to use Docker commands directly:

1. **Build the image:**
   ```bash
   docker-compose build
   ```

2. **Start the container:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

## Accessing the App

Once the development server is running, you can access:

- **Expo DevTools:** http://localhost:19002
- **Metro Bundler:** http://localhost:8081

### Running on Different Platforms

#### Web
1. Open Expo DevTools at http://localhost:19002
2. Click "Run in web browser"
3. Or press `w` in the terminal running the Expo server

#### iOS Simulator (Mac only)
1. Ensure you have Xcode installed
2. Open Expo DevTools at http://localhost:19002
3. Click "Run on iOS simulator"
4. Or press `i` in the terminal

#### Android Emulator
1. Ensure you have Android Studio installed with an emulator set up
2. Start your Android emulator
3. Open Expo DevTools at http://localhost:19002
4. Click "Run on Android device/emulator"
5. Or press `a` in the terminal

#### Physical Device (Expo Go App)
1. Install Expo Go from the App Store (iOS) or Play Store (Android)
2. Make sure your device is on the same network as your computer
3. Scan the QR code shown in Expo DevTools or terminal

## Available Commands

The `docker-setup.sh` script provides the following commands:

| Command | Description |
|---------|-------------|
| `build` | Build the Docker image |
| `start` | Start the development server in detached mode |
| `stop` | Stop the development server |
| `restart` | Restart the development server |
| `logs` | View development server logs (Ctrl+C to exit) |
| `exec <command>` | Execute a command inside the container |
| `install` | Install/update npm dependencies |
| `clean` | Remove all Docker resources (containers, images, volumes) |
| `help` | Show help message |

### Examples

```bash
# Install new dependencies
./start.sh exec npm install react-native-maps

# Run linter
./start.sh exec npm run lint

# Run a specific npm script
./start.sh exec npm run android

# Access container shell
./start.sh exec sh
```

## Project Structure

```
coach-app/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker build
├── docker-setup.sh        # Helper script for Docker operations
├── DOCKER_SETUP.md        # This file
├── package.json           # Node.js dependencies
├── app/                   # Expo app source code
├── components/            # React components
└── ...
```

## How It Works

### Dockerfile

The `Dockerfile` defines the development environment:
- Based on `node:20-alpine` (lightweight Node.js image)
- Installs system dependencies
- Copies package files and installs npm dependencies
- Exposes ports for Expo development server
- Sets environment variables for network access

### docker-compose.yml

The `docker-compose.yml` orchestrates the container:
- Builds the Docker image
- Maps ports to your local machine
- Mounts source code for hot reload
- Uses a named volume for `node_modules` to improve performance
- Sets environment variables

### Port Mapping

The following ports are exposed:

| Port | Service |
|------|---------|
| 8081 | Metro Bundler |
| 19000 | Expo DevTools |
| 19001 | Expo DevTools (alternative) |
| 19002 | Expo DevTools (web interface) |

## Troubleshooting

### Container won't start

1. **Check if ports are already in use:**
   ```bash
   lsof -i :8081
   lsof -i :19000
   ```

2. **Stop any conflicting services and restart:**
   ```bash
   ./start.sh restart
   ```

### Can't connect to the app on physical device

1. **Ensure your device is on the same network as your computer**
2. **Check firewall settings** - Docker needs to be allowed to accept incoming connections
3. **Try tunnel mode in Expo:**
   ```bash
   ./start.sh exec npx expo start --tunnel
   ```

### Changes not reflecting (hot reload not working)

1. **Verify volume mounting:**
   ```bash
   docker-compose config
   ```

2. **Restart the development server:**
   ```bash
   ./start.sh restart
   ```

### Dependencies not installing

1. **Clear Docker cache and rebuild:**
   ```bash
   ./start.sh clean
   ./start.sh build
   ```

2. **Install dependencies manually:**
   ```bash
   ./start.sh install
   ```

### Out of disk space

Docker can consume significant disk space. To clean up:

```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove all volumes (WARNING: This will delete all data)
docker volume prune
```

## Performance Optimization

### For Mac/Windows Users

Docker on Mac/Windows can be slower due to file system overhead. To improve performance:

1. **Allocate more resources to Docker:**
   - Open Docker Desktop
   - Go to Preferences/Settings → Resources
   - Increase CPU and Memory limits

2. **Use named volumes for node_modules:**
   - Already configured in `docker-compose.yml`
   - Keeps dependencies in Docker's native filesystem

### For Linux Users

Linux users typically get better performance as Docker runs natively. However:

1. **Ensure you're using Docker's storage driver optimally:**
   ```bash
   docker info | grep "Storage Driver"
   ```

2. **Consider using overlay2 storage driver** (usually default)

## Environment Variables

You can customize the development environment by creating a `.env` file:

```bash
# .env
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
NODE_ENV=development
API_BASE_URL=http://localhost:8000/api
```

Then update `docker-compose.yml` to load the `.env` file:

```yaml
services:
  coach-app:
    env_file:
      - .env
```

## Development Workflow

### Typical Development Session

1. **Start the server:**
   ```bash
   ./start.sh start
   ```

2. **View logs (optional):**
   ```bash
   ./start.sh logs
   ```

3. **Make changes to your code:**
   - Edit files in your IDE
   - Changes will hot-reload automatically

4. **Run tests or linting:**
   ```bash
   ./start.sh exec npm run lint
   ```

5. **When done, stop the server:**
   ```bash
   ./start.sh stop
   ```

### Adding New Dependencies

```bash
# Add a new package
./start.sh exec npm install <package-name>

# Or if the container is not running
./start.sh install
```

### Updating Expo SDK

```bash
./start.sh exec npx expo install --fix
```

## CI/CD Integration

You can use this Docker setup in CI/CD pipelines:

### GitHub Actions Example

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker-compose build

      - name: Run linter
        run: docker-compose run --rm coach-app npm run lint

      - name: Build for production
        run: docker-compose run --rm coach-app npx expo export:web
```

## Production Builds

While this Docker setup is optimized for development, you can also use it for production builds:

### Web Build

```bash
./start.sh exec npx expo export:web
```

### Native Builds (EAS Build)

```bash
# Install EAS CLI
./start.sh exec npm install -g eas-cli

# Configure EAS
./start.sh exec eas build:configure

# Build for iOS
./start.sh exec eas build --platform ios

# Build for Android
./start.sh exec eas build --platform android
```

## Comparison: Docker vs Native Setup

| Aspect | Docker | Native |
|--------|--------|--------|
| Setup Time | ✅ Fast (one command) | ⏱️ Slower (install Node, dependencies) |
| Consistency | ✅ Same environment for all developers | ❌ Can vary between machines |
| Isolation | ✅ Isolated from system | ❌ Uses system Node/npm |
| Performance | ⚠️ Slightly slower on Mac/Windows | ✅ Native performance |
| Disk Space | ⚠️ Requires more space | ✅ Less space |
| Learning Curve | ⚠️ Requires Docker knowledge | ✅ Familiar npm workflow |

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Project Frontend Specification](./FRONTEND_SPECIFICATION.md)

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Docker logs: `./docker-setup.sh logs`
3. Check Docker status: `docker ps`
4. Verify Docker resources: `docker system df`
5. Open an issue in the project repository

---

**Happy Coding!**
