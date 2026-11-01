-- ============================================================================
-- 002: Multi-Tenant Provisioning & Tenant Isolation Enhancements
-- Production-ready for wargaku PostgreSQL schema
-- ============================================================================

-- 1. Ensure komplek_id column exists on JSONB tables for syncAllFromSupabase
ALTER TABLE public.wargaku_rws 
ADD COLUMN IF NOT EXISTS komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE;

ALTER TABLE public.wargaku_rts 
ADD COLUMN IF NOT EXISTS komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE;

ALTER TABLE public.wargaku_warga 
ADD COLUMN IF NOT EXISTS komplek_id UUID REFERENCES public.wargaku_kompleks(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rws_komplek ON public.wargaku_rws(komplek_id);
CREATE INDEX IF NOT EXISTS idx_rts_komplek ON public.wargaku_rts(komplek_id);
CREATE INDEX IF NOT EXISTS idx_warga_komplek ON public.wargaku_warga(komplek_id);

-- 2. Stored Procedure: provision_new_komplek
CREATE OR REPLACE FUNCTION public.provision_new_komplek(
  p_komplek_nama TEXT,
  p_komplek_alamat TEXT DEFAULT '',
  p_komplek_kota TEXT DEFAULT '',
  p_komplek_kode_pos TEXT DEFAULT '',
  p_admin_name TEXT DEFAULT '',
  p_admin_phone TEXT DEFAULT '',
  p_admin_email TEXT DEFAULT '',
  p_admin_password TEXT DEFAULT '123456'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_komplek_id UUID;
  v_admin_user_id UUID;
  v_rw_id UUID;
  v_rt_id UUID;
  v_pos_iuran_id UUID;
  v_auth_user_id UUID;
  v_kode_komplek TEXT;
  v_result JSONB;
BEGIN
  -- Validate inputs
  IF p_komplek_nama IS NULL OR TRIM(p_komplek_nama) = '' THEN
    RAISE EXCEPTION 'Nama komplek wajib diisi';
  END IF;
  
  IF p_admin_name IS NULL OR TRIM(p_admin_name) = '' THEN
    RAISE EXCEPTION 'Nama admin wajib diisi';
  END IF;
  
  IF p_admin_phone IS NULL OR TRIM(p_admin_phone) = '' THEN
    RAISE EXCEPTION 'Nomor HP admin wajib diisi';
  END IF;
  
  IF p_admin_password IS NULL OR LENGTH(p_admin_password) < 6 THEN
    RAISE EXCEPTION 'Password minimal 6 karakter';
  END IF;

  -- Generate unique kode_komplek
  v_kode_komplek := 'KMP-' || UPPER(SUBSTRING(REGEXP_REPLACE(p_komplek_nama, '[^a-zA-Z0-9]', '', 'g') FROM 1 FOR 8)) || '-' || LPAD(FLOOR(RANDOM()*1000)::TEXT, 3, '0');

  -- 1. Create Komplek
  INSERT INTO public.wargaku_kompleks (kode_komplek, nama, alamat, tipe_iuran, is_active, settings)
  VALUES (
    v_kode_komplek,
    TRIM(p_komplek_nama),
    TRIM(p_komplek_alamat),
    'flat',
    TRUE,
    jsonb_build_object(
      'kota', TRIM(p_komplek_kota),
      'kode_pos', TRIM(p_komplek_kode_pos),
      'enable_surat', true,
      'enable_fasum', true,
      'payment_method', 'manual'
    )
  )
  RETURNING id INTO v_komplek_id;
  
  -- 2. Create RW 01 in relational table wargaku_rw
  INSERT INTO public.wargaku_rw (id, komplek_id, nomor_rw, nama_ketua, kontak)
  VALUES (
    gen_random_uuid(),
    v_komplek_id,
    '01',
    'Ketua RW 01',
    ''
  )
  RETURNING id INTO v_rw_id;
  
  -- 3. Create RT 01 in relational table wargaku_rt
  INSERT INTO public.wargaku_rt (id, komplek_id, rw_id, nomor_rt, nama_ketua, kontak)
  VALUES (
    gen_random_uuid(),
    v_komplek_id,
    v_rw_id,
    '01',
    'Ketua RT 01',
    ''
  )
  RETURNING id INTO v_rt_id;

  -- 4. Sync to wargaku_rws and wargaku_rts (JSONB sync tables for offline-first)
  INSERT INTO public.wargaku_rws (id, komplek_id, data, updated_at)
  VALUES (
    'rw-' || v_komplek_id || '-01',
    v_komplek_id,
    jsonb_build_object(
      'id', 'rw-' || v_komplek_id || '-01',
      'name', 'RW 01',
      'number', '01',
      'komplek_id', v_komplek_id,
      'status', 'active',
      'ketua', 'Ketua RW 01'
    ),
    NOW()
  );

  INSERT INTO public.wargaku_rts (id, komplek_id, data, updated_at)
  VALUES (
    'rt-' || v_komplek_id || '-01-01',
    v_komplek_id,
    jsonb_build_object(
      'id', 'rt-' || v_komplek_id || '-01-01',
      'name', 'RT 01 / RW 01',
      'number', '01',
      'rw_id', 'rw-' || v_komplek_id || '-01',
      'komplek_id', v_komplek_id,
      'status', 'active',
      'ketua', 'Ketua RT 01'
    ),
    NOW()
  );
  
  -- 5. Try creating auth.users if Supabase Auth is active
  v_auth_user_id := gen_random_uuid();
  BEGIN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      phone,
      phone_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_auth_user_id,
      'authenticated',
      'authenticated',
      COALESCE(NULLIF(TRIM(p_admin_email), ''), TRIM(p_admin_phone) || '@temp.local'),
      crypt(p_admin_password, gen_salt('bf')),
      NOW(),
      TRIM(p_admin_phone),
      NOW(),
      jsonb_build_object(
        'name', TRIM(p_admin_name),
        'phone', TRIM(p_admin_phone),
        'role', 'admin',
        'komplek_id', v_komplek_id
      ),
      NOW(),
      NOW()
    );
  EXCEPTION
    WHEN OTHERS THEN
      NULL;
  END;
  
  -- 6. Create Admin User Record in public.wargaku_users
  INSERT INTO public.wargaku_users (
    id,
    komplek_id,
    phone,
    password_hash,
    role,
    status,
    full_name,
    email
  )
  VALUES (
    v_auth_user_id,
    v_komplek_id,
    TRIM(p_admin_phone),
    crypt(p_admin_password, gen_salt('bf')),
    'admin',
    'active',
    TRIM(p_admin_name),
    NULLIF(TRIM(p_admin_email), '')
  )
  RETURNING id INTO v_admin_user_id;
  
  -- 7. Create Default Pos Iuran IPL
  INSERT INTO public.pos_iuran (komplek_id, data)
  VALUES (
    v_komplek_id,
    jsonb_build_object(
      'nama', 'IPL Bulanan',
      'kode', 'IPL',
      'deskripsi', 'Iuran Pemeliharaan Lingkungan bulanan',
      'nominal_default', 150000,
      'is_active', true,
      'is_wajib', true,
      'periode', 'bulanan',
      'tanggal_jatuh_tempo', 10,
      'created_by', v_admin_user_id,
      'created_at', NOW()
    )
  )
  RETURNING id INTO v_pos_iuran_id;
  
  -- 8. Create komplek_metadata
  INSERT INTO public.komplek_metadata (komplek_id, data)
  VALUES (
    v_komplek_id,
    jsonb_build_object(
      'subscription', jsonb_build_object(
        'status', 'active',
        'plan', 'pro',
        'started_at', NOW(),
        'expires_at', NOW() + INTERVAL '1 year'
      ),
      'feature_flags', jsonb_build_object(
        'surat_online', true,
        'qris_payment', true,
        'kas_digital', true
      ),
      'onboarding', jsonb_build_object(
        'completed', true,
        'completed_at', NOW(),
        'steps_completed', ARRAY['setup_komplek', 'create_admin', 'seed_wilayah', 'seed_pos_iuran']
      )
    )
  );

  -- 9. Insert Audit Log
  INSERT INTO public.wargaku_audit_logs (komplek_id, user_id, action, target_table, target_id, new_data)
  VALUES (
    v_komplek_id,
    v_admin_user_id,
    'KOMPLEK_PROVISIONED',
    'wargaku_kompleks',
    v_komplek_id,
    jsonb_build_object(
      'kode_komplek', v_kode_komplek,
      'nama', p_komplek_nama,
      'admin_phone', p_admin_phone
    )
  );
  
  -- Build result
  v_result := jsonb_build_object(
    'success', true,
    'komplek_id', v_komplek_id,
    'kode_komplek', v_kode_komplek,
    'komplek_nama', p_komplek_nama,
    'admin_user_id', v_admin_user_id,
    'admin_name', p_admin_name,
    'rw_id', v_rw_id,
    'rw_name', 'RW 01',
    'rt_id', v_rt_id,
    'rt_name', 'RT 01 / RW 01',
    'pos_iuran_id', v_pos_iuran_id,
    'pos_iuran_nama', 'IPL Bulanan',
    'message', 'Komplek berhasil dibuat dengan RW 01, RT 01, dan Pos Iuran IPL default'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Gagal membuat komplek: ' || SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.provision_new_komplek TO authenticated, anon, postgres;

-- 3. Stored Procedure: validate_tenant_relationships
CREATE OR REPLACE FUNCTION public.validate_tenant_relationships(
  p_komplek_id UUID,
  p_rw_id UUID,
  p_rt_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rw_komplek_id UUID;
  v_rt_komplek_id UUID;
  v_rt_rw_id UUID;
BEGIN
  IF p_rw_id IS NOT NULL THEN
    SELECT komplek_id INTO v_rw_komplek_id
    FROM public.wargaku_rw
    WHERE id = p_rw_id;
    
    IF v_rw_komplek_id IS NULL OR v_rw_komplek_id != p_komplek_id THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  IF p_rt_id IS NOT NULL THEN
    SELECT komplek_id, rw_id INTO v_rt_komplek_id, v_rt_rw_id
    FROM public.wargaku_rt
    WHERE id = p_rt_id;
    
    IF v_rt_komplek_id IS NULL OR v_rt_komplek_id != p_komplek_id THEN
      RETURN FALSE;
    END IF;
    
    IF p_rw_id IS NOT NULL AND (v_rt_rw_id IS NULL OR v_rt_rw_id != p_rw_id) THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_tenant_relationships TO authenticated, anon, postgres;
