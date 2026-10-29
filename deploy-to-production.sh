#!/bin/bash
# Deploy script for RBAC backend to production server
# Run: bash deploy-to-production.sh

set -e

SERVER_USER="adminapi"
SERVER_HOST="103.134.221.201"
SERVER_PASS="@dminApi2026"
DB_USER="adminapp"
DB_PASS="@dminAppDb2026"
DB_HOST="103.134.221.200"

echo "=========================================="
echo "🚀 WARGAKU RBAC BACKEND DEPLOYMENT"
echo "=========================================="

# Create deployment package
echo "📦 Creating deployment package..."
cd /home/adly/Projects/ipl
tar -czf backend-rbac-v2.tar.gz backend-api/
echo "✅ Package created: backend-rbac-v2.tar.gz"

# Upload to server
echo ""
echo "📤 Uploading to server..."
sshpass -p "$SERVER_PASS" scp backend-rbac-v2.tar.gz ${SERVER_USER}@${SERVER_HOST}:~/

# Execute deployment on server
echo ""
echo "🔧 Deploying on server..."
sshpass -p "$SERVER_PASS" ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
set -e

# Backup existing
if [ -d ~/backend-api ]; then
    BACKUP_NAME="backend-api.backup-$(date +%Y%m%d-%H%M%S)"
    echo "📋 Backing up existing backend to $BACKUP_NAME"
    mv ~/backend-api ~/$BACKUP_NAME
fi

# Extract new version
echo "📂 Extracting new backend..."
cd ~
tar -xzf backend-rbac-v2.tar.gz
rm backend-rbac-v2.tar.gz

# Install dependencies
echo "📥 Installing dependencies..."
cd ~/backend-api
npm install --production

# Create production .env
echo "⚙️  Creating production .env..."
cat > .env << 'EOF'
PORT=8000
SERVER_URL=https://api-warga.glosindo.net.id
DB_HOST=103.134.221.200
DB_PORT=5432
DB_USER=adminapp
DB_PASSWORD=@dminAppDb2026
DB_NAME=postgres
JWT_SECRET=wargaku-ipl-production-secret-key-2026-rbac-multitenant
JWT_EXPIRES=30d
EOF

echo "✅ Deployment files ready"
ENDSSH

echo ""
echo "🗄️  Running database migration..."
sshpass -p "$SERVER_PASS" ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDMIGRATION'
cd ~/backend-api
node run-migration.js
ENDMIGRATION

echo ""
echo "🔄 Restarting API service..."
sshpass -p "$SERVER_PASS" ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDRESTART'
# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

cd ~/backend-api

# Stop and remove old process
pm2 stop wargaku-api 2>/dev/null || true
pm2 delete wargaku-api 2>/dev/null || true

# Start new process
pm2 start server.js --name wargaku-api --time
pm2 save

echo "✅ PM2 process started"
ENDRESTART

echo ""
echo "🧪 Testing API endpoints..."
sleep 3

# Test health endpoint
echo "Testing /health..."
sshpass -p "$SERVER_PASS" ssh ${SERVER_USER}@${SERVER_HOST} "curl -s http://localhost:8000/health | head -20"

echo ""
echo "Testing /api/auth/login..."
sshpass -p "$SERVER_PASS" ssh ${SERVER_USER}@${SERVER_HOST} "curl -s -X POST http://localhost:8000/api/auth/login -H 'Content-Type: application/json' -d '{\"phone\":\"08123456789\",\"password\":\"admin123\"}' | head -20"

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY"
echo "=========================================="
echo "🌐 API URL: https://api-warga.glosindo.net.id"
echo "👤 Superadmin: 08123456789 / admin123"
echo ""
echo "View logs: ssh adminapi@103.134.221.201 'pm2 logs wargaku-api'"
echo "Check status: ssh adminapi@103.134.221.201 'pm2 status'"
