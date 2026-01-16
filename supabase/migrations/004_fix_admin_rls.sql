-- Drop existing policies that query auth.users directly
DROP POLICY IF EXISTS "View approvals policy" ON user_approvals;
DROP POLICY IF EXISTS "Admin update policy" ON user_approvals;
DROP POLICY IF EXISTS "Insert policy" ON user_approvals;

-- RLS Policy: Admin can view all, users can view their own
-- Uses is_admin() SECURITY DEFINER function to avoid permission errors
CREATE POLICY "View approvals policy"
ON user_approvals FOR SELECT
TO authenticated
USING (
  -- Admin can see all (using SECURITY DEFINER function)
  is_admin(auth.uid())
  OR 
  -- Users can see their own
  user_id = auth.uid()
);

-- RLS Policy: Admin can update, users can update their own pending records
-- Uses is_admin() SECURITY DEFINER function to avoid permission errors
CREATE POLICY "Admin update policy"
ON user_approvals FOR UPDATE
TO authenticated
USING (
  -- Admin can update all
  is_admin(auth.uid())
  OR
  -- Users can update their own pending records (for upsert)
  user_id = auth.uid()
)
WITH CHECK (
  -- Admin can set any status
  is_admin(auth.uid())
  OR
  -- Users can only keep status as pending (for upsert)
  (user_id = auth.uid() AND status = 'pending')
);

-- RLS Policy: Allow inserts for authenticated users creating their own record
CREATE POLICY "Insert policy"
ON user_approvals FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());  -- Users can only insert their own records

COMMENT ON POLICY "View approvals policy" ON user_approvals IS 'Admin can view all approvals, users can view their own';
COMMENT ON POLICY "Admin update policy" ON user_approvals IS 'Admin can update all, users can update their own pending records for upsert';
COMMENT ON POLICY "Insert policy" ON user_approvals IS 'Users can only create approval requests for themselves';
