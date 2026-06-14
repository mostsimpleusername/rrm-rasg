-- ============================================================================
-- Rumah Amal Salman Garut (RASG) — Database Schema
-- Supabase (PostgreSQL) schema for organization management dashboard
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM TYPES (ENUMS)
-- ============================================================================

-- Role assigned to each user in the system
CREATE TYPE user_role AS ENUM ('super_admin', 'division_admin', 'member');

-- Available organizational divisions
CREATE TYPE division_type AS ENUM (
  'HR',
  'Lingkungan',
  'Media',
  'Ristek',
  'Kesehatan',
  'Pendidikan',
  'Umum'
);

-- Membership status of a user
CREATE TYPE user_status AS ENUM ('Aktif', 'Nonaktif', 'Menunggu');

-- Lifecycle status of an event
CREATE TYPE event_status AS ENUM ('Akan Datang', 'Berlangsung', 'Selesai', 'Dibatalkan');


-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- profiles — extends Supabase auth.users with application-specific fields
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  role       user_role   NOT NULL DEFAULT 'member',
  division   division_type NOT NULL DEFAULT 'Umum',
  status     user_status NOT NULL DEFAULT 'Menunggu',
  join_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Application user profiles, one-to-one with auth.users.';

-- ---------------------------------------------------------------------------
-- events — organisational events managed by admins
-- ---------------------------------------------------------------------------
CREATE TABLE events (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT         NOT NULL,
  description      TEXT,
  date             DATE         NOT NULL,
  time             TIME         NOT NULL,
  location         TEXT         NOT NULL,
  division         division_type NOT NULL,
  status           event_status NOT NULL DEFAULT 'Akan Datang',
  max_participants INT,
  created_by       UUID         REFERENCES profiles(id),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE events IS 'Events organised by the various RASG divisions.';

-- ---------------------------------------------------------------------------
-- event_attendees — junction table linking users to events they attend
-- ---------------------------------------------------------------------------
CREATE TABLE event_attendees (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_event_user UNIQUE (event_id, user_id)
);

COMMENT ON TABLE event_attendees IS 'Tracks which users are registered for which events.';


-- ============================================================================
-- 3. HELPER FUNCTIONS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- is_admin() — returns TRUE when the current user is a super_admin or
--              division_admin.  Used inside RLS policies for brevity.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'division_admin')
  );
$$;

COMMENT ON FUNCTION is_admin IS 'Check whether the current authenticated user holds an admin role.';


-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on every table --------------------------------------------------
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- ---- profiles ---------------------------------------------------------------

-- Any authenticated user may read all profiles
CREATE POLICY "profiles: authenticated can read"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users may update their own profile
CREATE POLICY "profiles: users can update own"
  ON profiles FOR UPDATE
  TO authenticated
  USING  (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Super admins may update any profile
CREATE POLICY "profiles: super_admin can update any"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Division admins may update profiles in their own division
CREATE POLICY "profiles: division_admin can update own division"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'division_admin'
    AND division = (SELECT division FROM profiles WHERE id = auth.uid())
    AND role != 'super_admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'division_admin'
    AND division = (SELECT division FROM profiles WHERE id = auth.uid())
    AND role != 'super_admin'
  );

-- ---- events -----------------------------------------------------------------

-- Any authenticated user may read all events
CREATE POLICY "events: authenticated can read"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Only admins may create events (Division Admins can only insert for their division)
CREATE POLICY "events: admins can insert"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin() AND (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR
      division = (SELECT division FROM profiles WHERE id = auth.uid())
    )
  );

-- Only admins may update events
CREATE POLICY "events: admins can update"
  ON events FOR UPDATE
  TO authenticated
  USING (
    is_admin() AND (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR
      division = (SELECT division FROM profiles WHERE id = auth.uid())
    )
  )
  WITH CHECK (
    is_admin() AND (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR
      division = (SELECT division FROM profiles WHERE id = auth.uid())
    )
  );

-- Only admins may delete events
CREATE POLICY "events: admins can delete"
  ON events FOR DELETE
  TO authenticated
  USING (
    is_admin() AND (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin' OR
      division = (SELECT division FROM profiles WHERE id = auth.uid())
    )
  );

-- ---- event_attendees --------------------------------------------------------

-- Any authenticated user may read all attendance records
CREATE POLICY "event_attendees: authenticated can read"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

-- Users may register themselves for an event, Admins may register anyone
CREATE POLICY "event_attendees: users can insert own or admin"
  ON event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR is_admin());

-- Users may remove their own attendance, admins may remove anyone's
CREATE POLICY "event_attendees: users can delete own or admin"
  ON event_attendees FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR is_admin()
  );


-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- updated_at auto-updater — reusable trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Attach the trigger to profiles
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Attach the trigger to events
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user — auto-create a profiles row when a user signs up
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

-- Fire after every new row in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
