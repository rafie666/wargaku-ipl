#!/bin/bash
echo "=========================================="
echo "🚀 WARGAKU RBAC DEPLOYMENT (Interactive)"
echo "=========================================="
echo ""
echo "Package: backend-rbac-v2.tar.gz (5.7MB)"
echo "Target: adminapi@103.134.221.201"
echo ""
echo "Press ENTER to start upload..."
read

scp backend-rbac-v2.tar.gz adminapi@103.134.221.201:~/

echo ""
echo "✅ Upload done. Now SSH to server and run:"
echo ""
echo "ssh adminapi@103.134.221.201"
echo ""
echo "Then execute these commands:"
echo ""
cat << 'COMMANDS'
# Backup & extract
mv ~/backend-api ~/backend-api.backup-$(date +%Y%m%d) 2>/dev/null || true
tar -xzf ~/backend-rbac-v2.tar.gz
cd ~/backend-api

# Install
npm install --production

# Configure
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

# Migrate database
node run-migration.js

# Deploy with PM2
npm install -g pm2 2>/dev/null || true
pm2 stop wargaku-api 2>/dev/null || true
pm2 delete wargaku-api 2>/dev/null || true
pm2 start server.js --name wargaku-api
pm2 save

# Test
sleep 2
curl http://localhost:8000/health
COMMANDS

echo ""
echo "Copy commands above and paste in SSH session"
