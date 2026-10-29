# WARGAKU RBAC BACKEND v2.3.0 - DEPLOYMENT SUMMARY

## ✅ FASE 1 COMPLETED: Backend RBAC Multi-Tenant

### Database Schema (PostgreSQL)
- ✅ `wargaku_kompleks` - Master komplek/perumahan
- ✅ `wargaku_users` - User accounts (phone-based login, JWT auth)
- ✅ `wargaku_rw` - Master RW per komplek
- ✅ `wargaku_rt` - Master RT per RW
- ✅ `wargaku_residents` - Unit hunian/rumah
- ✅ `wargaku_tagihan` - Tagihan IPL
- ✅ `wargaku_kas` - Buku kas
- ✅ `wargaku_surat` - Surat pengantar
- ✅ `wargaku_pengaduan` - Pengaduan fasum
- ✅ `wargaku_emergency_contacts` - Kontak darurat per komplek
- ✅ `wargaku_jadwal_satpam` - Jadwal satpam
- ✅ `wargaku_announcements` - Broadcast & pengumuman
- ✅ `wargaku_audit_logs` - Audit trail

### API Endpoints
- ✅ `POST /api/auth/register` - Warga registration (pending_approval)
- ✅ `POST /api/auth/login` - JWT authentication (phone + password)
- ✅ `GET /api/auth/pending-users` - List pending approvals (Admin Komplek)
- ✅ `PATCH /api/auth/users/:id/approve` - Approve/reject warga (Admin Komplek)
- ✅ `POST /api/admin/komplek` - Create komplek + admin (Superadmin only)
- ✅ `PATCH /api/admin/residents/:id/unlink` - Unlink penyewa pindah (Admin Komplek)
- ✅ `PATCH /api/admin/users/:id/assign-role` - Change role warga→RT/RW/etc (Admin Komplek)
- ✅ `POST /api/seed/kompleks/:id/seed` - Seed RW/RT/Iuran data (Admin)

### Middleware & Security
- ✅ JWT token authentication (`middleware/auth.js`)
- ✅ Multi-tenant isolation (`middleware/tenancy.js`)
- ✅ Role-based access control (RBAC)
- ✅ Status checking (pending_approval, active, rejected, suspended, inactive)
- ✅ Audit logging for critical actions

### Default Accounts
- **Superadmin:** `phone: 08123456789`, `password: admin123`

### Files Ready for Deployment
- ✅ `backend-rbac-v2.tar.gz` (5.7 MB)
- ✅ Migration script: `migrations/001_rbac_schema.sql`
- ✅ Deployment guide: `DEPLOYMENT_GUIDE.txt`
- ✅ Quick deploy: `DEPLOY_NOW.sh`

---

## 📦 DEPLOYMENT PACKAGE LOCATION
```
/home/adly/Projects/ipl/backend-rbac-v2.tar.gz
```

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### Server Credentials
- **API Server:** 103.134.221.201
- **User:** adminapi
- **Password:** @dminApi2026
- **DB Server:** 103.134.221.200
- **DB User:** adminapp
- **DB Password:** @dminAppDb2026

### Quick Deploy (Copy-Paste to Terminal)

```bash
# 1. Upload package
scp /home/adly/Projects/ipl/backend-rbac-v2.tar.gz adminapi@103.134.221.201:~/

# 2. SSH to server
ssh adminapi@103.134.221.201

# 3. Deploy (paste this entire block in SSH session)
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
curl -s http://localhost:8000/health
```

---

## 🧪 POST-DEPLOYMENT TESTING

```bash
# Test health
curl https://api-warga.glosindo.net.id/health

# Test superadmin login
curl -X POST https://api-warga.glosindo.net.id/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"08123456789","password":"admin123"}'

# Create first komplek (replace TOKEN with JWT from login)
curl -X POST https://api-warga.glosindo.net.id/api/admin/komplek \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "kode_komplek": "GRI-001",
    "nama": "Griya Permata Bintaro",
    "alamat": "Jl. Permata Raya No. 1, Bintaro",
    "admin_phone": "081234567890",
    "admin_name": "Admin Griya",
    "admin_password": "admin123"
  }'
```

---

## ⚠️ IMPORTANT NOTES

1. **Mobile App Integration NOT Done** - Mobile app masih offline-first JSONB pattern
2. **Backend ONLY** - API ready, mobile needs major refactor (LoginScreen, AppContext, authService)
3. **Manual Deployment Required** - No SSH key configured, needs interactive password

---

## 📋 NEXT STEPS (If Mobile Integration Needed)

1. Update `LoginScreen.js` - change username → phone
2. Refactor `AppContext.js` - integrate JWT + backend API
3. Update `authService.js` - call `/api/auth/login` endpoint
4. Add role-based navigation guards in `RootNavigator.js`
5. Update all screens with pending_approval status handling
6. Replace offline storage with backend sync

Estimated: 50+ file changes, 2-3 days work.

---

**Status:** Backend complete ✅ | Deployment package ready ✅ | Manual upload required ⏳
