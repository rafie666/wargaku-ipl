#!/usr/bin/env bash
set -e

# ========================================================
# WARGAKU IPL - ONE-CLICK OVER-THE-AIR (OTA) UPDATE SCRIPT
# ========================================================
# This script bundles the latest JS & assets and pushes
# them directly to Server 2 (103.134.221.201).
# Resident apps will automatically download the new update
# in the background the next time they are opened.
# ========================================================

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MOBILE_DIR="$BASE_DIR/ipl-mobile"
SCRATCH_DIR="/home/adly/.gemini/antigravity/brain/c7c14e0d-7a79-4347-a027-fce0488b0897/scratch"
SERVER_API="103.134.221.201"
API_USER="adminapi"
API_PASS='@dminApi2026'

echo "=================================================="
echo "🚀 EXPORTING ANDROID BUNDLE..."
echo "=================================================="
cd "$MOBILE_DIR"
npx expo export --platform android

echo ""
echo "=================================================="
echo "📡 PUSHING UPDATE TO SERVER 2 (103.134.221.201)..."
echo "=================================================="
python3 "$SCRATCH_DIR/remote_copy.py" "$MOBILE_DIR/dist" "$SERVER_API" "$API_USER" "$API_PASS" "/home/adminapi/wargaku-api/updates/"
python3 "$SCRATCH_DIR/remote_exec.py" "$SERVER_API" "$API_USER" "$API_PASS" "rm -rf /home/adminapi/wargaku-api/updates/current && mv /home/adminapi/wargaku-api/updates/dist /home/adminapi/wargaku-api/updates/current"

# Also sync local backend-api updates folder
mkdir -p "$BASE_DIR/backend-api/updates/current"
cp -r "$MOBILE_DIR/dist/"* "$BASE_DIR/backend-api/updates/current/"

echo ""
echo "=================================================="
echo "🔍 VERIFYING OTA UPDATE ON SERVER 2..."
echo "=================================================="
MANIFEST_RESP=$(curl -s -H "expo-platform: android" -H "expo-runtime-version: 2.0.0" -H "expo-protocol-version: 1" "https://api-warga.glosindo.net.id/api/manifest")

if echo "$MANIFEST_RESP" | grep -q "launchAsset"; then
    echo "✅ OTA UPDATE BERHASIL DILUNCURKAN!"
    echo "📱 Warga yang membuka aplikasi akan otomatis mengunduh pembaruan terbaru di background!"
else
    echo "⚠️ Warning: Respon manifest tidak terduga:"
    echo "$MANIFEST_RESP"
fi
