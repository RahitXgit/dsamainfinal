-- ============================================
-- Custom Auth Migration: Create Users Table
-- ============================================

-- Create users table (replacing dependency on auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update user_approvals foreign key constraint
-- Remove old constraint that references auth.users
ALTER TABLE user_approvals DROP CONSTRAINT IF EXISTS user_approvals_user_id_fkey;
ALTER TABLE user_approvals DROP CONSTRAINT IF EXISTS user_approvals_reviewed_by_fkey;

-- Add new foreign key to custom users table
ALTER TABLE user_approvals 
  ADD CONSTRAINT user_approvals_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_approvals 
  ADD CONSTRAINT user_approvals_reviewed_by_fkey 
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

-- Disable RLS? NO. Enable it but deny all public access.
-- Only Service Role will be able to access these tables.
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "View approvals policy" ON user_approvals;
DROP POLICY IF EXISTS "Admin update policy" ON user_approvals;
DROP POLICY IF EXISTS "Insert policy" ON user_approvals;
DROP POLICY IF EXISTS "Allow all operations" ON user_approvals;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- No policies = Deny All for public/anon/authenticated roles.
-- Only database owner and Service Role can access.

COMMENT ON TABLE users IS 'Custom users table for NextAuth.js authentication (Service Role access only)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
