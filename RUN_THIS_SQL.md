# 🚨 URGENT: Run This SQL in Supabase Dashboard

## The Error You're Seeing

```
Error checking approval status: {}
```

This is happening because the RLS policies haven't been updated yet in your database.

## How to Fix (2 minutes)

### Step 1: Copy This SQL

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "View approvals policy" ON user_approvals;
DROP POLICY IF EXISTS "Admin update policy" ON user_approvals;
DROP POLICY IF EXISTS "Insert policy" ON user_approvals;

-- View policy: Admin sees all, users see their own
CREATE POLICY "View approvals policy"
ON user_approvals FOR SELECT
TO authenticated
USING (
  is_admin(auth.uid())
  OR 
  user_id = auth.uid()
);

-- Update policy: Admin updates all, users update their own pending records
CREATE POLICY "Admin update policy"
ON user_approvals FOR UPDATE
TO authenticated
USING (
  is_admin(auth.uid())
  OR
  user_id = auth.uid()
)
WITH CHECK (
  is_admin(auth.uid())
  OR
  (user_id = auth.uid() AND status = 'pending')
);

-- Insert policy: Users can only insert their own records
CREATE POLICY "Insert policy"
ON user_approvals FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
```

### Step 2: Run in Supabase

1. Go to: https://supabase.com/dashboard/project/pnorzizesvihahfgvmdp/sql/new
2. Paste the SQL above
3. Click **RUN** (or press Ctrl+Enter)

### Step 3: Refresh Your App

After running the SQL, refresh your browser and the error should be gone!

## What This Fixes

✅ Admin dashboard will load approval requests  
✅ Pending approval page will work without errors  
✅ Users can sign up again without RLS violations  
✅ Upsert operations will work correctly
