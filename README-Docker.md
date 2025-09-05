# RuralCart - Docker Setup

A mobile-first delivery app for rural areas, containerized with Docker for easy local development.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Port 5000 available

### One-Command Setup
```bash
chmod +x docker-setup.sh && ./docker-setup.sh
```

### Manual Setup
```bash
# Build the app
docker-compose build

# Start the app
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📱 Access the App
- **Web App**: http://localhost:5000
- **Mobile**: Open in browser and add to home screen for mobile experience

## 🛠️ Development Commands

```bash
# Stop the app
docker-compose down

# Restart the app
docker-compose restart

# View real-time logs
docker-compose logs -f ruralcart

# Rebuild after code changes
docker-compose up --build
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
PORT=5000
NODE_ENV=production
```

### Database (Optional)
Uncomment the PostgreSQL service in `docker-compose.yml` for persistent data storage.

## 📋 Features
- ✅ Mobile-optimized UI
- ✅ Product catalog with categories
- ✅ Shopping cart & checkout
- ✅ Order tracking system
- ✅ User profiles
- ✅ SMS notifications (ready for Twilio)
- ✅ Offline indicator
- ✅ Rural-friendly design

## 🏗️ Architecture
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **State**: Zustand + React Query
- **Container**: Multi-stage Docker build
- **Size**: ~150MB optimized image