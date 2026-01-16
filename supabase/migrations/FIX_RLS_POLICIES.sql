-- Fix RLS policies for admin dashboard
-- Run this in Supabase SQL Editor

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "View approvals policy" ON user_approvals;

-- Create new SELECT policy that works properly
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

-- Verify the policy
SELECT * FROM user_approvals;
