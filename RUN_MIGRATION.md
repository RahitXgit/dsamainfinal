# 🚨 ACTION REQUIRED: Run This SQL for Custom Auth

We have moved to a secure custom authentication system. You need to run this migration to set up the new database structure.

## How to Apply

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pnorzizesvihahfgvmdp
2. Click **SQL Editor** → **New Query**
3. Copy the SQL below
4. Paste and click **RUN**

## SQL to Run

```sql
-- ============================================
-- Custom Auth Migration: Secure Setup
-- ============================================

-- ⚠️ STEP 1: CLEAR OLD DATA FIRST
-- We must clear the table because it has references to old users that don't exist anymore.
-- If we don't do this, the foreign key constraint will fail.
DELETE FROM user_approvals;

-- Create users table (NextAuth credentials)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster logins
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update foreign keys in user_approvals
ALTER TABLE user_approvals DROP CONSTRAINT IF EXISTS user_approvals_user_id_fkey;
ALTER TABLE user_approvals DROP CONSTRAINT IF EXISTS user_approvals_reviewed_by_fkey;

ALTER TABLE user_approvals 
  ADD CONSTRAINT user_approvals_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_approvals 
  ADD CONSTRAINT user_approvals_reviewed_by_fkey 
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL;

-- 🛡️ SECURITY: Enable RLS and Deny All Public Access
-- This ensures ONLY the Service Role (our API) can access data
ALTER TABLE user_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop all old permissive policies
DROP POLICY IF EXISTS "View approvals policy" ON user_approvals;
DROP POLICY IF EXISTS "Admin update policy" ON user_approvals;
DROP POLICY IF EXISTS "Insert policy" ON user_approvals;
DROP POLICY IF EXISTS "Allow all operations" ON user_approvals;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- No policies created = Default DENY ALL for public/anon/authenticated
-- only Service Role key (backend) can read/write.
```

## What This Does

- ✅ Creates a secure `users` table for storing credentials
- ✅ Links `user_approvals` to the new table
- ✅ **Locks down the database**: Only your API can read/write data
- ✅ Prevents any direct access from the frontend (maximum security)

## After Running

1. **Restart your dev server**: `npm run dev`
2. **Sign up**: Create a new account (it will use the new system)
3. **Admin**: Manage approvals as usual (now using secure API)
