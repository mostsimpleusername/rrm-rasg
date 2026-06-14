-- ============================================================================
-- Deep Clean and Reset for Seeded Users
-- ============================================================================
UPDATE auth.users
SET
  -- 1. Enforce the exact GoTrue bcrypt password signature
  encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf', 10)),
  
  -- 2. Match the exact instance and authentication structural fields
  instance_id = '00000000-0000-0000-0000-000000000000',
  aud = 'authenticated',
  role = 'authenticated',
  is_sso_user = FALSE,
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW(),
  
  -- 3. Standardize metadata structures
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email', 
    'providers', jsonb_build_array('email')
  ),
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb),
  
  -- 4. Clean tokens to prevent GoTrue parsing crashes
  confirmation_token = '',
  email_change = '',
  email_change_token_new = '',
  recovery_token = '',
  email_change_token_current = '',
  phone_change_token = '',
  phone = NULL
WHERE email IN (
  'admin@org.com',
  'wit@org.com',
  'fufu@org.com',
  'kesehatan@org.com',
  'member1@org.com',
  'member2@org.com',
  'member3@org.com',
  'new@org.com'
);
