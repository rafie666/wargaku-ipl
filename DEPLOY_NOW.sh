#!/bin/bash
echo "=========================================="
echo "🚀 WARGAKU RBAC v2.3.0 - DEPLOYMENT"
echo "=========================================="
echo ""
echo "✅ Package: backend-rbac-v2.tar.gz (5.7MB)"
echo "📍 Location: /home/adly/Projects/ipl/"
echo ""
echo "🎯 DEPLOYMENT OPTIONS:"
echo ""
echo "OPTION 1: Manual SCP + SSH"
echo "--------------------------"
echo "1. Upload:"
echo "   scp backend-rbac-v2.tar.gz adminapi@103.134.221.201:~/"
echo ""
echo "2. SSH & Deploy:"
echo "   ssh adminapi@103.134.221.201"
echo "   Password: @dminApi2026"
echo ""
echo "3. Run on server:"
cat << 'SERVERCOMMANDS'
cd ~ && \
mv backend-api backend-api.backup-$(date +%Y%m%d-%H%M) 2>/dev/null; \
tar -xzf backend-rbac-v2.tar.gz && cd backend-api && \
npm install --production && \
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
node run-migration.js && \
pm2 stop wargaku-api 2>/dev/null; pm2 delete wargaku-api 2>/dev/null; \
pm2 start server.js --name wargaku-api && pm2 save && \
echo "" && echo "✅ Deployed. Testing..." && sleep 3 && \
curl -s http://localhost:8000/health | head -5
SERVERCOMMANDS
echo ""
echo "OPTION 2: FileZilla/FTP Upload"
echo "-------------------------------"
echo "1. Upload backend-rbac-v2.tar.gz to server"
echo "2. SSH and extract manually"
echo ""
echo "=========================================="
echo "📚 Full guide: DEPLOYMENT_GUIDE.txt"
echo "=========================================="
