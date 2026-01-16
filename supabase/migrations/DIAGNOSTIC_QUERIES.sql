-- ============================================
-- Database Diagnostic Queries
-- Run these in Supabase SQL Editor to verify setup
-- ============================================

-- 1. Check if user_approvals table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_approvals'
) AS table_exists;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_approvals'
ORDER BY ordinal_position;

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_approvals';

-- 4. List all RLS policies on user_approvals
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_approvals';

-- 5. Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- 6. Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_approval_request', 'is_user_approved', 'is_admin');

-- 7. View all current approval requests
SELECT * FROM user_approvals ORDER BY requested_at DESC;

-- 8. Count users by approval status
SELECT status, COUNT(*) as count
FROM user_approvals
GROUP BY status;

-- ============================================
-- TROUBLESHOOTING QUERIES
-- ============================================

-- If table doesn't exist, run the migration first!
-- If trigger doesn't exist on auth.users, you may need to:

-- Check if you have permission to create triggers on auth.users
SELECT has_table_privilege('auth.users', 'TRIGGER') AS can_create_trigger;

-- Alternative: Create trigger manually if auto-creation failed
-- (Only run if trigger doesn't exist)
/*
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_approval_request();
*/

-- ============================================
-- TEST QUERIES
-- ============================================

-- Test if admin check works
SELECT is_admin('YOUR_USER_ID_HERE'::uuid);

-- Test if approval check works  
SELECT is_user_approved('YOUR_USER_ID_HERE'::uuid);

-- Manually insert a test approval (if needed for testing)
/*
INSERT INTO user_approvals (user_id, email, status)
VALUES (
    'YOUR_USER_ID_HERE'::uuid,
    'test@example.com',
    'pending'
);
*/
