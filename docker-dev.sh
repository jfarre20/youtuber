#!/bin/bash

# YouTube Clip Sequencer - Docker Development Script
# This script provides convenient commands for Docker development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_status "Docker and Docker Compose are installed."
}

# Main menu
show_menu() {
    echo "=========================================="
    echo " YouTube Clip Sequencer - Docker Setup"
    echo "=========================================="
    echo ""
    echo "Available options:"
    echo "1) Start development environment (with hot reload)"
    echo "2) Start production environment"
    echo "3) Start full stack (frontend + backend + database)"
    echo "4) Build production image"
    echo "5) Run tests in container"
    echo "6) Clean up containers and volumes"
    echo "7) View logs"
    echo "8) Stop all services"
    echo "9) Exit"
    echo ""
    read -p "Select an option (1-9): " choice
    echo ""
}

# Start development environment
start_dev() {
    print_info "Starting development environment..."
    print_info "Frontend will be available at: http://localhost:3000"
    print_info "Hot reload is enabled for development"
    print_warning "Press Ctrl+C to stop the development server"

    docker-compose --profile development up frontend-dev
}

# Start production environment
start_prod() {
    print_info "Starting production environment..."
    print_info "Frontend will be available at: http://localhost"
    print_info "Using optimized production build"

    docker-compose --profile production up
}

# Start full stack
start_fullstack() {
    print_info "Starting full stack environment..."
    print_info "Frontend: http://localhost"
    print_info "Backend API: http://localhost:3001"
    print_info "PostgreSQL: localhost:5432"
    print_info "Redis: localhost:6379"

    docker-compose up
}

# Build production image
build_prod() {
    print_info "Building production image..."
    print_info "This may take a few minutes..."

    docker build -t youtube-sequencer:latest .

    if [ $? -eq 0 ]; then
        print_status "Production image built successfully!"
        print_info "You can now run it with: docker run -p 80:80 youtube-sequencer"
    else
        print_error "Failed to build production image"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_info "Running tests in container..."

    # This assumes you have test scripts in package.json
    # You may need to adjust this based on your actual test setup
    docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
        npm install
        npm run test
    "
}

# Clean up
cleanup() {
    print_warning "This will stop all containers and remove volumes!"
    read -p "Are you sure? (y/N): " confirm

    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_info "Cleaning up containers and volumes..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

# View logs
view_logs() {
    print_info "Showing logs for all services..."
    print_warning "Press Ctrl+C to exit logs view"

    docker-compose logs -f
}

# Stop all services
stop_all() {
    print_info "Stopping all services..."
    docker-compose down
    print_status "All services stopped!"
}

# Main script logic
main() {
    check_docker

    while true; do
        show_menu

        case $choice in
            1)
                start_dev
                ;;
            2)
                start_prod
                ;;
            3)
                start_fullstack
                ;;
            4)
                build_prod
                ;;
            5)
                run_tests
                ;;
            6)
                cleanup
                ;;
            7)
                view_logs
                ;;
            8)
                stop_all
                ;;
            9)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please select 1-9."
                ;;
        esac

        echo ""
        read -p "Press Enter to continue..."
        echo ""
    done
}

# Handle script arguments
if [ $# -gt 0 ]; then
    case $1 in
        "dev")
            check_docker
            start_dev
            ;;
        "prod")
            check_docker
            start_prod
            ;;
        "fullstack")
            check_docker
            start_fullstack
            ;;
        "build")
            check_docker
            build_prod
            ;;
        "test")
            check_docker
            run_tests
            ;;
        "cleanup")
            check_docker
            cleanup
            ;;
        "logs")
            check_docker
            view_logs
            ;;
        "stop")
            check_docker
            stop_all
            ;;
        *)
            print_error "Unknown argument: $1"
            echo "Usage: $0 [dev|prod|fullstack|build|test|cleanup|logs|stop]"
            exit 1
            ;;
    esac
else
    main
fi
