-- ==========================================
-- DESTRUCTIVE MIGRATION: Drop JSONB schema, create relational RBAC schema
-- WARNING: This drops all existing wargaku_* tables
-- ==========================================

DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'wargaku_%') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', r.tablename;
    END LOOP;
END $$;

-- 1. Master Tenant / Komplek
CREATE TABLE public.wargaku_kompleks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_komplek VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    alamat TEXT,
    tipe_iuran VARCHAR(50) DEFAULT 'flat',
    is_active BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{
        "enable_surat": true,
        "enable_fasum": true,
        "payment_method": "manual"
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master RW per Komplek
CREATE TABLE public.wargaku_rw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    nomor_rw VARCHAR(10) NOT NULL,
    nama_ketua VARCHAR(150),
    kontak VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(komplek_id, nomor_rw)
);

-- 3. Master RT per RW di Komplek
CREATE TABLE public.wargaku_rt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    rw_id UUID NOT NULL REFERENCES public.wargaku_rw(id) ON DELETE CASCADE,
    nomor_rt VARCHAR(10) NOT NULL,
    nama_ketua VARCHAR(150),
    kontak VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(komplek_id, rw_id, nomor_rt)
);

-- 4. Master Akun Pengguna (Users)
CREATE TABLE public.wargaku_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_approval',
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    assigned_rw_id UUID REFERENCES public.wargaku_rw(id) ON DELETE SET NULL,
    assigned_rt_id UUID REFERENCES public.wargaku_rt(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.wargaku_users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_role CHECK (role IN ('superadmin', 'admin', 'rw', 'rt', 'bendahara', 'pengurus', 'warga')),
    CONSTRAINT chk_status CHECK (status IN ('pending_approval', 'active', 'rejected', 'suspended', 'inactive'))
);

-- 5. Master Unit Hunian / Rumah Warga
CREATE TABLE public.wargaku_residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    rw_id UUID NOT NULL REFERENCES public.wargaku_rw(id) ON DELETE RESTRICT,
    rt_id UUID NOT NULL REFERENCES public.wargaku_rt(id) ON DELETE RESTRICT,
    blok VARCHAR(20) NOT NULL,
    nomor_rumah VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES public.wargaku_users(id) ON DELETE SET NULL,
    tipe_penghuni VARCHAR(30) DEFAULT 'pemilik',
    status_huni VARCHAR(30) DEFAULT 'tetap',
    luas_tanah NUMERIC(10,2) DEFAULT 0,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(komplek_id, blok, nomor_rumah),
    CONSTRAINT chk_tipe_penghuni CHECK (tipe_penghuni IN ('pemilik', 'penyewa')),
    CONSTRAINT chk_status_huni CHECK (status_huni IN ('tetap', 'kontrak', 'kosong'))
);

-- 6. Pos Tarif Iuran
CREATE TABLE public.wargaku_jenis_iuran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    nama VARCHAR(100) NOT NULL,
    nominal NUMERIC(15,2) NOT NULL DEFAULT 0,
    tipe VARCHAR(50) DEFAULT 'bulanan',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tagihan IPL Warga
CREATE TABLE public.wargaku_tagihan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES public.wargaku_residents(id) ON DELETE CASCADE,
    periode VARCHAR(20) NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Belum Bayar',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_evidence JSONB DEFAULT NULL,
    verified_by UUID REFERENCES public.wargaku_users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_status_tagihan CHECK (status IN ('Belum Bayar', 'Menunggu Verifikasi', 'Lunas', 'Jatuh Tempo'))
);

-- 8. Buku Kas
CREATE TABLE public.wargaku_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    rw_id UUID REFERENCES public.wargaku_rw(id) ON DELETE SET NULL,
    rt_id UUID REFERENCES public.wargaku_rt(id) ON DELETE SET NULL,
    tanggal DATE NOT NULL,
    tipe VARCHAR(20) NOT NULL,
    kategori VARCHAR(100),
    nominal NUMERIC(15,2) NOT NULL,
    keterangan TEXT,
    created_by UUID REFERENCES public.wargaku_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_tipe_kas CHECK (tipe IN ('masuk', 'keluar'))
);

-- 9. Surat Pengantar
CREATE TABLE public.wargaku_surat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    pemohon_id UUID NOT NULL REFERENCES public.wargaku_users(id),
    rt_id UUID NOT NULL REFERENCES public.wargaku_rt(id),
    rw_id UUID NOT NULL REFERENCES public.wargaku_rw(id),
    jenis_surat VARCHAR(100) NOT NULL,
    keperluan TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'pending',
    approved_by_rt UUID REFERENCES public.wargaku_users(id),
    approved_by_rw UUID REFERENCES public.wargaku_users(id),
    approved_at TIMESTAMPTZ,
    rejected_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_status_surat CHECK (status IN ('pending', 'approved_rt', 'approved_rw', 'rejected'))
);

-- 10. Pengaduan Fasum
CREATE TABLE public.wargaku_pengaduan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    pelapor_id UUID NOT NULL REFERENCES public.wargaku_users(id),
    kategori VARCHAR(100) NOT NULL,
    lokasi VARCHAR(200),
    deskripsi TEXT NOT NULL,
    foto_url TEXT,
    status VARCHAR(30) DEFAULT 'baru',
    ditangani_oleh UUID REFERENCES public.wargaku_users(id),
    tanggapan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_status_pengaduan CHECK (status IN ('baru', 'proses', 'selesai', 'ditolak'))
);

-- 11. Kontak Darurat & Keamanan per Komplek
CREATE TABLE public.wargaku_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    nama_pos VARCHAR(100) NOT NULL,
    nomor_telepon VARCHAR(30) NOT NULL,
    kategori VARCHAR(50) DEFAULT 'satpam',
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_kategori_emergency CHECK (kategori IN ('satpam', 'damkar', 'polisi', 'medis'))
);

-- 12. Jadwal Satpam
CREATE TABLE public.wargaku_jadwal_satpam (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID NOT NULL REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    nama_petugas VARCHAR(150) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    hari DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Broadcast & Pengumuman
CREATE TABLE public.wargaku_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.wargaku_users(id),
    target_rw_id UUID REFERENCES public.wargaku_rw(id) ON DELETE CASCADE,
    target_rt_id UUID REFERENCES public.wargaku_rt(id) ON DELETE CASCADE,
    judul VARCHAR(200) NOT NULL,
    isi TEXT NOT NULL,
    tipe VARCHAR(50) DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_tipe_announcement CHECK (tipe IN ('info', 'penting', 'darurat'))
);

-- 14. Audit Logs
CREATE TABLE public.wargaku_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.wargaku_users(id),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Keep legacy tables for backward compatibility (JSONB pattern)
CREATE TABLE public.wargaku_config (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_warga (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_events (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_tagihan_events (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_bank_accounts (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_qris_accounts (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_notifications (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_moota_mutations (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_petugas_satpam (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_admin_auth (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_rws (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_rts (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wargaku_kontak_darurat (
    id TEXT PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance & Isolation Indexes
CREATE INDEX idx_users_komplek_status ON public.wargaku_users(komplek_id, status, role);
CREATE INDEX idx_users_phone ON public.wargaku_users(phone);
CREATE INDEX idx_rw_komplek ON public.wargaku_rw(komplek_id);
CREATE INDEX idx_rt_komplek_rw ON public.wargaku_rt(komplek_id, rw_id);
CREATE INDEX idx_residents_komplek_rt ON public.wargaku_residents(komplek_id, rt_id);
CREATE INDEX idx_residents_komplek_blok_no ON public.wargaku_residents(komplek_id, blok, nomor_rumah);
CREATE INDEX idx_residents_user_id ON public.wargaku_residents(user_id);
CREATE INDEX idx_tagihan_komplek_resident_periode ON public.wargaku_tagihan(komplek_id, resident_id, periode);
CREATE INDEX idx_kas_komplek_tanggal ON public.wargaku_kas(komplek_id, tanggal DESC);
CREATE INDEX idx_surat_komplek_status ON public.wargaku_surat(komplek_id, status);
CREATE INDEX idx_pengaduan_komplek_status ON public.wargaku_pengaduan(komplek_id, status);
CREATE INDEX idx_emergency_komplek ON public.wargaku_emergency_contacts(komplek_id);
CREATE INDEX idx_announcements_komplek ON public.wargaku_announcements(komplek_id);
CREATE INDEX idx_audit_komplek_created ON public.wargaku_audit_logs(komplek_id, created_at DESC);

-- Create default Superadmin user (password: admin123)
INSERT INTO public.wargaku_users (id, phone, password_hash, role, status, full_name, komplek_id)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '08123456789',
  '$2b$10$F9.iA0gq8hePkRHlXohq0OOunhbZe74F2ummVx4DTdlKia3UoJrbG',
  'superadmin',
  'active',
  'Super Admin',
  NULL
);
