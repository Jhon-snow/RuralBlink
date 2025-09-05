#!/bin/bash

# RuralCart Docker Setup Script
echo "🚚 Setting up RuralCart delivery app with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Build and start the application
echo "🏗️  Building RuralCart app..."
docker-compose build

echo "🚀 Starting RuralCart app..."
docker-compose up -d

echo "⏳ Waiting for app to start..."
sleep 10

# Check if app is running
if curl -f http://localhost:5000/api/categories &> /dev/null; then
    echo "✅ RuralCart is running successfully!"
    echo ""
    echo "🎉 Your RuralCart delivery app is now running at:"
    echo "   http://localhost:5000"
    echo ""
    echo "📱 Features available:"
    echo "   • Mobile-first design"
    echo "   • Product catalog with categories"
    echo "   • Shopping cart & checkout"
    echo "   • Order tracking"
    echo "   • User profiles"
    echo "   • SMS notifications (simulated)"
    echo ""
    echo "🛠️  Management commands:"
    echo "   • Stop app:     docker-compose down"
    echo "   • View logs:    docker-compose logs -f"
    echo "   • Restart:      docker-compose restart"
else
    echo "❌ Failed to start RuralCart. Check logs with:"
    echo "   docker-compose logs"
fi