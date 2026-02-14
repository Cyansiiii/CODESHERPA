# 🐳 Complete Docker Setup Guide for CodeSherpa

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check Docker installation
docker --version
# Should show: Docker version 20.x.x or higher

# Check Docker Compose
docker compose version
# Should show: Docker Compose version v2.x.x or higher

# Check Docker is running
docker ps
# Should show: CONTAINER ID   IMAGE   ... (empty list is fine)
```

If any command fails, install Docker Desktop from: https://www.docker.com/products/docker-desktop

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Stop any running servers
# (Press Ctrl+C in terminals running backend/frontend)

# 2. Build and start all services
docker compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Backend Health: http://localhost:8000/health
```

---

## 📂 Project Structure Overview

Your CodeSherpa project already has everything needed:

```
AI-FOR-BHARAT/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents (Orchestrator, Review Monk, Sherpa)
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Config, Redis client
│   │   ├── services/        # Bedrock, GitHub services
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend container config
│   └── .env                # Environment variables (CREATED ✅)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Node dependencies
│   ├── Dockerfile          # Frontend container config
│   └── vite.config.js      # Vite configuration
└── docker-compose.yml      # Orchestrates all services
```

---

## 🔧 Step-by-Step Docker Setup

### Step 1: Verify Environment Variables ✅

Your `.env` file has been created in `backend/.env` with:
- ✅ GitHub Token configured
- ⚠️ AWS Bedrock credentials (placeholder - will use mock mode)
- ✅ Redis URL configured for Docker network

### Step 2: Understanding the Services

Your `docker-compose.yml` defines 3 services:

1. **Backend** (Python FastAPI)
   - Port: 8000
   - Connects to Redis
   - Runs AI agents

2. **Frontend** (React + Vite)
   - Port: 3000 (production) or 5173 (dev)
   - Connects to Backend

3. **Redis** (Cache/Session Storage)
   - Port: 6379
   - Stores session data

### Step 3: Build Docker Images

```bash
# Build all services (first time or after code changes)
docker compose build

# Expected output:
# [+] Building 45.2s (23/23) FINISHED
# => [backend] ...
# => [frontend] ...
# => [redis] ...
```

### Step 4: Start All Services

```bash
# Start in foreground (see logs)
docker compose up

# OR start in background (detached mode)
docker compose up -d

# Expected output:
# [+] Running 3/3
# ✔ Container codesherpa-redis-1     Started
# ✔ Container codesherpa-backend-1   Started
# ✔ Container codesherpa-frontend-1  Started
```

### Step 5: Verify Services Are Running

```bash
# Check running containers
docker compose ps

# Expected output:
# NAME                    STATUS    PORTS
# codesherpa-backend-1    Up        0.0.0.0:8000->8000/tcp
# codesherpa-frontend-1   Up        0.0.0.0:3000->80/tcp
# codesherpa-redis-1      Up        0.0.0.0:6379->6379/tcp

# Test backend health
curl http://localhost:8000/health
# Expected: {"status":"ok","service":"CodeSherpa Backend"}

# Test frontend (open in browser)
open http://localhost:3000
```

---

## 🎯 Common Docker Commands

### Starting & Stopping

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# Restart a specific service
docker compose restart backend
```

### Viewing Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View logs for specific service
docker compose logs backend
docker compose logs frontend
docker compose logs redis

# Last 50 lines
docker compose logs --tail=50
```

### Rebuilding After Code Changes

```bash
# Rebuild and restart
docker compose up --build

# Rebuild specific service
docker compose build backend
docker compose up -d backend

# Force rebuild (no cache)
docker compose build --no-cache
```

### Accessing Container Shell

```bash
# Access backend container
docker compose exec backend bash

# Access frontend container
docker compose exec frontend sh

# Access Redis CLI
docker compose exec redis redis-cli
```

### Cleaning Up

```bash
# Stop and remove containers
docker compose down

# Remove containers, networks, and volumes
docker compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## 🔍 Troubleshooting

### Problem 1: Port Already in Use

**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**
```bash
# Stop your running backend/frontend servers first
# Then check what's using the port
lsof -i :8000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

### Problem 2: Container Keeps Restarting

**Check logs:**
```bash
docker compose logs backend
```

**Common causes:**
- Missing dependencies in requirements.txt
- Syntax errors in Python code
- Environment variables not set

**Solution:**
```bash
# Rebuild with no cache
docker compose build --no-cache backend
docker compose up backend
```

### Problem 3: Frontend Can't Connect to Backend

**Check:**
1. Backend is running: `curl http://localhost:8000/health`
2. CORS is configured in `backend/app/main.py`
3. Frontend is using correct API URL

**Solution:**
```bash
# Check backend logs
docker compose logs backend

# Restart both services
docker compose restart backend frontend
```

### Problem 4: Redis Connection Failed

**Check Redis:**
```bash
# Check if Redis is running
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping
# Should return: PONG

# Check backend can connect
docker compose logs backend | grep -i redis
```

### Problem 5: Changes Not Reflecting

**Solution:**
```bash
# For backend changes (Python)
docker compose restart backend

# For frontend changes (React)
docker compose restart frontend

# If still not working, rebuild
docker compose up --build
```

---

## 🎨 Development Workflow

### Option 1: Docker for Everything (Recommended for Production)

```bash
# Start all services
docker compose up

# Make code changes
# Changes auto-reload (volumes are mounted)

# View logs
docker compose logs -f

# Stop when done
docker compose down
```

### Option 2: Hybrid (Current Setup - Recommended for Development)

```bash
# Run only Redis in Docker
docker compose up redis -d

# Run backend locally
cd backend
uvicorn app.main:app --reload

# Run frontend locally
cd frontend
npm run dev

# Benefits:
# - Faster hot reload
# - Easier debugging
# - Direct access to logs
```

### Option 3: Full Local (No Docker)

```bash
# Install Redis locally
brew install redis  # macOS
redis-server

# Run backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Run frontend
cd frontend
npm install
npm run dev
```

---

## 📊 Monitoring & Debugging

### View Resource Usage

```bash
# See CPU, memory usage
docker stats

# See disk usage
docker system df
```

### Inspect Containers

```bash
# Get container details
docker compose ps
docker inspect codesherpa-backend-1

# Check environment variables
docker compose exec backend env
```

### Network Debugging

```bash
# List networks
docker network ls

# Inspect network
docker network inspect ai-for-bharat_default

# Test connectivity between containers
docker compose exec backend ping redis
docker compose exec frontend ping backend
```

---

## 🚀 Production Deployment

### Build for Production

```bash
# Build optimized images
docker compose -f docker-compose.yml build

# Tag images for registry
docker tag codesherpa-backend:latest your-registry/codesherpa-backend:v1.0
docker tag codesherpa-frontend:latest your-registry/codesherpa-frontend:v1.0

# Push to registry
docker push your-registry/codesherpa-backend:v1.0
docker push your-registry/codesherpa-frontend:v1.0
```

### Environment-Specific Configs

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    environment:
      - DEBUG=false
      - LOG_LEVEL=warning
    restart: always
    
  frontend:
    environment:
      - NODE_ENV=production
    restart: always
    
  redis:
    volumes:
      - redis_data:/data
    restart: always

volumes:
  redis_data:
```

Run with:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🔐 Security Best Practices

1. **Never commit .env files**
   ```bash
   # Already in .gitignore
   echo "backend/.env" >> .gitignore
   ```

2. **Use secrets for production**
   ```yaml
   services:
     backend:
       secrets:
         - aws_access_key
         - github_token
   
   secrets:
     aws_access_key:
       external: true
     github_token:
       external: true
   ```

3. **Run as non-root user**
   ```dockerfile
   # In Dockerfile
   RUN useradd -m appuser
   USER appuser
   ```

4. **Scan images for vulnerabilities**
   ```bash
   docker scan codesherpa-backend:latest
   ```

---

## 📝 Quick Reference

### Essential Commands

| Task | Command |
|------|---------|
| Start all services | `docker compose up` |
| Start in background | `docker compose up -d` |
| Stop all services | `docker compose down` |
| View logs | `docker compose logs -f` |
| Rebuild | `docker compose up --build` |
| Restart service | `docker compose restart backend` |
| Shell access | `docker compose exec backend bash` |
| Clean everything | `docker compose down -v && docker system prune -a` |

### Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React UI |
| Backend API | http://localhost:8000 | FastAPI server |
| Backend Health | http://localhost:8000/health | Health check |
| Backend Docs | http://localhost:8000/docs | Swagger UI |
| Redis | localhost:6379 | Cache server |
| WebSocket | ws://localhost:8000/ws | Real-time chat |

---

## 🎓 Next Steps

1. **Test the Docker setup:**
   ```bash
   docker compose up --build
   ```

2. **Try the demo commands:**
   - Open http://localhost:3000
   - Type "Namaste demo"
   - Type "Review demo"

3. **Add AWS Bedrock credentials** (when ready):
   - Edit `backend/.env`
   - Add real AWS keys
   - Restart: `docker compose restart backend`

4. **Deploy to cloud:**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

## 🆘 Getting Help

**Check logs first:**
```bash
docker compose logs -f
```

**Common issues:**
- Port conflicts → Change ports in docker-compose.yml
- Build failures → Check Dockerfile syntax
- Connection issues → Verify network configuration
- Performance issues → Increase Docker resources in Docker Desktop

**Still stuck?**
- Check Docker Desktop dashboard
- Review container logs
- Inspect container: `docker compose exec backend bash`
- Test connectivity: `docker compose exec backend ping redis`

---

## ✅ Success Checklist

- [ ] Docker Desktop installed and running
- [ ] `.env` file created with credentials
- [ ] `docker compose build` completes successfully
- [ ] `docker compose up` starts all 3 services
- [ ] Backend health check returns OK
- [ ] Frontend loads in browser
- [ ] Chat interface connects via WebSocket
- [ ] Demo commands work ("Namaste demo", "Review demo")
- [ ] Logs show no critical errors

---

**🎉 You're all set! Your CodeSherpa is now running in Docker containers.**

For questions or issues, check the logs first: `docker compose logs -f`
