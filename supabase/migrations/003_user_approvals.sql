-- ============================================
-- User Approval System Migration
-- Admin: rahitdhara.main@gmail.com
-- ============================================

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

-- Create index for faster queries
CREATE INDEX idx_user_approvals_status ON user_approvals(status);
CREATE INDEX idx_user_approvals_email ON user_approvals(email);

-- Enable RLS
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin can view all approval requests, and users can view their own.
DROP POLICY IF EXISTS "Admin can view all approvals" ON user_approvals;
CREATE POLICY "Admin can view all approvals"
ON user_approvals FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid())
  OR user_id = auth.uid()
);

-- RLS Policy: Admin can update approvals
DROP POLICY IF EXISTS "Admin can update approvals" ON user_approvals;
CREATE POLICY "Admin can update approvals"
ON user_approvals FOR UPDATE
TO authenticated
USING (
  is_admin(auth.uid())
);

-- RLS Policy: System can insert on signup
CREATE POLICY "System can insert approvals"
ON user_approvals FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Function to create approval request on signup
CREATE OR REPLACE FUNCTION create_approval_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create approval request if not admin
  IF NEW.email != 'rahitdhara.main@gmail.com' THEN
    INSERT INTO user_approvals (user_id, email, status)
    VALUES (NEW.id, NEW.email, 'pending')
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    -- Auto-approve admin
    INSERT INTO user_approvals (user_id, email, status, reviewed_at, reviewed_by)
    VALUES (NEW.id, NEW.email, 'approved', NOW(), NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create approval request
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_approval_request();

-- Helper function to check if user is approved
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

-- Helper function to check if user is admin
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

-- View for pending approvals (admin only)
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
  ua.id,
  ua.user_id,
  ua.email,
  ua.status,
  ua.requested_at,
  ua.reviewed_at,
  ua.reviewed_by,
  ua.notes,
  u.created_at as user_created_at
FROM user_approvals ua
LEFT JOIN auth.users u ON ua.user_id = u.id
WHERE ua.status = 'pending'
ORDER BY ua.requested_at DESC;

-- Grant access to authenticated users
GRANT SELECT ON pending_approvals TO authenticated;

COMMENT ON TABLE user_approvals IS 'Stores user approval requests for admin review';
COMMENT ON FUNCTION is_user_approved IS 'Check if a user has been approved by admin';
COMMENT ON FUNCTION is_admin IS 'Check if a user is the admin';
