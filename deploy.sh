#!/bin/bash
set -e

echo "🚀 Starting deployment for aviatorguide / isportsguide..."

# 1. Pull latest code from GitHub
echo "📥 Pulling latest git changes..."
git pull origin main

# 2. Rebuild and restart docker containers in background
echo "🐳 Rebuilding and starting Docker containers with fresh code..."
docker compose build --no-cache app
docker compose up -d

# 3. Wait briefly for services to be ready
echo "⏳ Waiting for app container to initialize..."
sleep 5

# 4. Sync Prisma database schema
echo "🗄 Running Prisma database sync..."
docker compose exec app npx prisma db push --skip-generate || true

echo "✅ Deployment completed successfully!"
docker compose ps
