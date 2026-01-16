-- ============================================
-- SIMPLIFIED User Approval System (No Triggers)
-- Run this instead of 003_user_approvals.sql
-- ============================================

-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_approval_request();

-- Create user_approvals table
CREATE TABLE IF NOT EXISTS user_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_approvals_status ON user_approvals(status);
CREATE INDEX IF NOT EXISTS idx_user_approvals_email ON user_approvals(email);

-- Enable RLS
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all approvals" ON user_approvals;
DROP POLICY IF EXISTS "Admin can update approvals" ON user_approvals;
DROP POLICY IF EXISTS "System can insert approvals" ON user_approvals;
DROP POLICY IF EXISTS "Users can view own approval" ON user_approvals;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON user_approvals;

-- RLS Policy: Admin can view all, users can view their own
CREATE POLICY "View approvals policy"
ON user_approvals FOR SELECT
TO authenticated
USING (
  -- Admin can see all
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'rahitdhara.main@gmail.com'
  )
  OR 
  -- Users can see their own
  user_id = auth.uid()
);

-- RLS Policy: Admin can update
CREATE POLICY "Admin update policy"
ON user_approvals FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'rahitdhara.main@gmail.com'
  )
);

-- RLS Policy: Allow inserts for any authenticated user creating their own record
CREATE POLICY "Insert policy"
ON user_approvals FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all inserts, we control this in the app code

-- Helper functions
CREATE OR REPLACE FUNCTION is_user_approved(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  approval_status TEXT;
BEGIN
  SELECT status INTO approval_status
  FROM user_approvals
  WHERE user_id = user_uuid;
  
  RETURN approval_status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_uuid;
  
  RETURN user_email = 'rahitdhara.main@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-approve admin user (run this after admin signs up)
-- Replace with your actual admin user ID after signup
/*
INSERT INTO user_approvals (user_id, email, status, reviewed_at, reviewed_by)
SELECT id, email, 'approved', NOW(), id
FROM auth.users 
WHERE email = 'rahitdhara.main@gmail.com'
ON CONFLICT (user_id) DO UPDATE 
SET status = 'approved', reviewed_at = NOW();
*/

COMMENT ON TABLE user_approvals IS 'Stores user approval requests for admin review (manual insertion)';
COMMENT ON FUNCTION is_user_approved IS 'Check if a user has been approved by admin';
COMMENT ON FUNCTION is_admin IS 'Check if a user is the admin';
