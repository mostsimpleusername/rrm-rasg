-- ============================================================================
-- Rumah Amal Salman Garut (RASG) — Seed Data
-- ============================================================================
--
-- This script creates demo users directly in Supabase auth.users and
-- automatically links their profiles.
--
-- Make sure to run `CREATE EXTENSION IF NOT EXISTS pgcrypto;` first if it's
-- not already enabled in your Supabase project (usually enabled by default).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert into auth.users
-- We use deterministic UUIDs for these demo accounts to make seeding easier.
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  role, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES
  ('c4186419-7557-414c-9f89-8d197941088d', '00000000-0000-0000-0000-000000000000', 'admin@org.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Akmal Admin"}', NOW(), NOW(), 'authenticated', '', '', '', ''),
  ('e1a49f50-3882-4bf1-a084-25e2cd0258d4', '00000000-0000-0000-0000-000000000000', 'wit@org.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Bowo SDM"}', NOW(), NOW(), 'authenticated', '', '', '', ''),
  ('5e884898-888e-4f05-8fb9-9685a21ff461', '00000000-0000-0000-0000-000000000000', 'fufu@org.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Raka Anggota"}', NOW(), NOW(), 'authenticated', '', '', '', '');

-- The trigger `handle_new_user` automatically creates the profiles.
-- We must update their status, role, and division manually here.
UPDATE public.profiles SET role = 'super_admin', division = 'Umum', status = 'Aktif' WHERE id = 'c4186419-7557-414c-9f89-8d197941088d';
UPDATE public.profiles SET role = 'division_admin', division = 'HR', status = 'Aktif' WHERE id = 'e1a49f50-3882-4bf1-a084-25e2cd0258d4';
UPDATE public.profiles SET role = 'member', division = 'Ristek', status = 'Aktif' WHERE id = '5e884898-888e-4f05-8fb9-9685a21ff461';

-- ============================================================================
-- EVENTS
-- ============================================================================
-- Insert demo events created by the Super Admin

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
    'c4186419-7557-414c-9f89-8d197941088d'
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
    'c4186419-7557-414c-9f89-8d197941088d'
  );
