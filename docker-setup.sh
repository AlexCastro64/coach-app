#!/bin/bash

# Coach App - Docker Setup Script
# This script helps you set up and manage the frontend development environment using Docker

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Print header
print_header() {
    echo ""
    print_message "=====================================" "$BLUE"
    print_message "$1" "$BLUE"
    print_message "=====================================" "$BLUE"
    echo ""
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_message "Error: Docker is not installed. Please install Docker first." "$RED"
        print_message "Visit: https://docs.docker.com/get-docker/" "$YELLOW"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_message "Error: Docker Compose is not installed. Please install Docker Compose first." "$RED"
        print_message "Visit: https://docs.docker.com/compose/install/" "$YELLOW"
        exit 1
    fi
}

# Build Docker image
build() {
    print_header "Building Docker Image"
    docker-compose build
    print_message "Build completed successfully!" "$GREEN"
}

# Start the development server
start() {
    print_header "Starting Development Server"
    docker-compose up -d
    print_message "Development server started!" "$GREEN"
    print_message "You can now access:" "$BLUE"
    print_message "  - Expo DevTools: http://localhost:19002" "$YELLOW"
    print_message "  - Metro Bundler: http://localhost:8081" "$YELLOW"
    echo ""
    print_message "To view logs, run: ./docker-setup.sh logs" "$BLUE"
    print_message "To stop, run: ./docker-setup.sh stop" "$BLUE"
}

# Stop the development server
stop() {
    print_header "Stopping Development Server"
    docker-compose down
    print_message "Development server stopped!" "$GREEN"
}

# Restart the development server
restart() {
    print_header "Restarting Development Server"
    stop
    start
}

# View logs
logs() {
    print_header "Viewing Logs (Ctrl+C to exit)"
    docker-compose logs -f
}

# Run a command inside the container
run_command() {
    if [ -z "$1" ]; then
        print_message "Error: No command provided" "$RED"
        print_message "Usage: ./docker-setup.sh exec <command>" "$YELLOW"
        exit 1
    fi
    docker-compose exec coach-app "$@"
}

# Clean up Docker resources
clean() {
    print_header "Cleaning Up Docker Resources"
    print_message "This will remove containers, images, and volumes." "$YELLOW"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose rm -f
        print_message "Cleanup completed!" "$GREEN"
    else
        print_message "Cleanup cancelled." "$BLUE"
    fi
}

# Install dependencies
install() {
    print_header "Installing Dependencies"
    docker-compose run --rm coach-app npm install
    print_message "Dependencies installed successfully!" "$GREEN"
}

# Show help
show_help() {
    print_header "Coach App - Docker Setup Script"
    echo "Usage: ./docker-setup.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build the Docker image"
    echo "  start       Start the development server"
    echo "  stop        Stop the development server"
    echo "  restart     Restart the development server"
    echo "  logs        View development server logs"
    echo "  exec        Execute a command inside the container"
    echo "  install     Install/update npm dependencies"
    echo "  clean       Remove all Docker resources (containers, images, volumes)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-setup.sh build"
    echo "  ./docker-setup.sh start"
    echo "  ./docker-setup.sh exec npm run lint"
    echo "  ./docker-setup.sh logs"
    echo ""
}

# Main script logic
main() {
    # Check Docker installation
    check_docker

    # Parse command
    case "${1:-help}" in
        build)
            build
            ;;
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        logs)
            logs
            ;;
        exec)
            shift
            run_command "$@"
            ;;
        install)
            install
            ;;
        clean)
            clean
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_message "Error: Unknown command '$1'" "$RED"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
