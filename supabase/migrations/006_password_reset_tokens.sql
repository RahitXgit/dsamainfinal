-- Migration: Password Reset System
-- Description: Creates tables for password reset tokens and rate limiting
-- Author: DSA Tracker Team
-- Date: 2026-01-15

-- =====================================================
-- 1. Create password_reset_tokens table
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- =====================================================
-- 2. Create password_reset_requests table (for rate limiting)
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- Add indexes for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_email ON password_reset_requests(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_requested_at ON password_reset_requests(requested_at);

-- =====================================================
-- 3. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. RLS Policies for password_reset_tokens
-- =====================================================

-- Policy: Users can only view their own reset tokens
CREATE POLICY "Users can view own reset tokens"
    ON password_reset_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Service role can manage all tokens (for API endpoints)
CREATE POLICY "Service role can manage all reset tokens"
    ON password_reset_tokens
    FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Allow public insert for token creation (API will validate)
CREATE POLICY "Public can create reset tokens"
    ON password_reset_tokens
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 5. RLS Policies for password_reset_requests
-- =====================================================

-- Policy: Service role can manage all requests (for rate limiting)
CREATE POLICY "Service role can manage all reset requests"
    ON password_reset_requests
    FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Allow public insert for logging requests
CREATE POLICY "Public can log reset requests"
    ON password_reset_requests
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow public to read for rate limit checking
CREATE POLICY "Public can read reset requests for rate limiting"
    ON password_reset_requests
    FOR SELECT
    USING (true);

-- =====================================================
-- 6. Create cleanup function for expired tokens
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete expired tokens older than 24 hours
    DELETE FROM password_reset_tokens
    WHERE expires_at < NOW() - INTERVAL '24 hours';
    
    -- Delete old reset requests older than 30 days
    DELETE FROM password_reset_requests
    WHERE requested_at < NOW() - INTERVAL '30 days';
END;
$$;

-- =====================================================
-- 7. Grant necessary permissions
-- =====================================================
GRANT SELECT, INSERT ON password_reset_tokens TO anon;
GRANT SELECT, INSERT ON password_reset_requests TO anon;
GRANT ALL ON password_reset_tokens TO service_role;
GRANT ALL ON password_reset_requests TO service_role;

-- =====================================================
-- Migration Complete
-- =====================================================
-- To run this migration:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Paste this entire file
-- 4. Click "Run"
-- 
-- To verify:
-- SELECT * FROM password_reset_tokens;
-- SELECT * FROM password_reset_requests;
-- 
-- To cleanup expired tokens manually:
-- SELECT cleanup_expired_reset_tokens();
