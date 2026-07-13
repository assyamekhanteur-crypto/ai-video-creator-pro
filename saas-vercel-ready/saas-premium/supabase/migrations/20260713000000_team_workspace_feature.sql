ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS shared_with_team boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_owner_id ON team_members(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_owner_id ON team_invitations(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_team_members" ON team_members;
CREATE POLICY "select_own_team_members" ON team_members FOR SELECT
  TO authenticated USING (auth.uid() = owner_id OR auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_team_members" ON team_members;
CREATE POLICY "insert_own_team_members" ON team_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "update_own_team_members" ON team_members;
CREATE POLICY "update_own_team_members" ON team_members FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "delete_own_team_members" ON team_members;
CREATE POLICY "delete_own_team_members" ON team_members FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "select_own_team_invitations" ON team_invitations;
CREATE POLICY "select_own_team_invitations" ON team_invitations FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "insert_own_team_invitations" ON team_invitations;
CREATE POLICY "insert_own_team_invitations" ON team_invitations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "update_own_team_invitations" ON team_invitations;
CREATE POLICY "update_own_team_invitations" ON team_invitations FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "delete_own_team_invitations" ON team_invitations;
CREATE POLICY "delete_own_team_invitations" ON team_invitations FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);
