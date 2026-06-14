-- ============================================================================
-- Rumah Amal Salman Garut (RASG) — Seed Data
-- ============================================================================
--
-- IMPORTANT — User / Profile Seeding
-- -----------------------------------
-- The `profiles` table has a foreign-key constraint to `auth.users(id)`.
-- You CANNOT insert profiles directly without a matching auth.users row.
--
-- To create demo users, choose one of the following approaches:
--
--   1. Supabase Dashboard  → Authentication → Add User (invite or auto-confirm)
--   2. Supabase Auth API   → supabase.auth.signUp({ email, password, options })
--   3. Supabase CLI seed   → Use the `--auth` flag or call the GoTrue admin API
--
-- Once the auth user exists, the `handle_new_user` trigger will automatically
-- create a corresponding row in `profiles` with the user's email and name
-- (pulled from raw_user_meta_data).  You can then UPDATE the profile to set
-- `role`, `division`, and `status` as needed.
--
-- Example (after creating the user via Auth):
--
--   UPDATE profiles
--   SET role     = 'super_admin',
--       division = 'HR',
--       status   = 'Aktif'
--   WHERE email  = 'admin@rasg.org';
--
-- ============================================================================

-- ============================================================================
-- EVENTS
-- ============================================================================
-- NOTE: `created_by` is left NULL here because we don't have deterministic
-- user UUIDs yet.  After seeding users through Auth, you may update these
-- rows to reference the correct profile id.
-- ============================================================================

INSERT INTO events (title, description, date, time, location, division, status, max_participants, created_by)
VALUES
  (
    'Kick Off Moment 2026',
    'Acara pembukaan dan perkenalan program kerja RASG tahun 2026. Seluruh anggota diharapkan hadir untuk menyamakan visi dan misi organisasi.',
    '2026-02-01',
    '08:30',
    'Dapur Kadtenjo',
    'HR',
    'Akan Datang',
    100,
    NULL
  ),
  (
    'Workshop Kesehatan Mental',
    'Workshop interaktif membahas kesehatan mental bagi anggota organisasi. Menghadirkan narasumber dari bidang psikologi.',
    '2023-12-10',
    '14:00',
    'Ruang 303',
    'Kesehatan',
    'Selesai',
    50,
    NULL
  );
