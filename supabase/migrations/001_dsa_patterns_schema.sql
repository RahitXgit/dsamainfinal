-- ============================================
-- DSA Patterns Database Schema
-- Supabase/PostgreSQL Migration
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: dsa_categories
-- Stores the 15 main DSA pattern categories
-- ============================================

CREATE TABLE dsa_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  problem_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX idx_dsa_categories_display_order ON dsa_categories(display_order);

-- ============================================
-- TABLE 2: dsa_patterns
-- Stores the 93 specific patterns within categories
-- ============================================

CREATE TABLE dsa_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES dsa_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  problem_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, name),
  UNIQUE(category_id, display_order)
);

-- Create indexes for faster queries
CREATE INDEX idx_dsa_patterns_category_id ON dsa_patterns(category_id);
CREATE INDEX idx_dsa_patterns_display_order ON dsa_patterns(category_id, display_order);

-- ============================================
-- TABLE 3: dsa_problems
-- Stores the 404 individual problems
-- ============================================

CREATE TABLE dsa_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_id UUID NOT NULL REFERENCES dsa_patterns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  
  -- Problem Links (multiple platforms)
  leetcode_url TEXT,
  leetcode_number INTEGER,
  leetcode_slug TEXT,
  hackerrank_url TEXT,
  codeforces_url TEXT,
  geeksforgeeks_url TEXT,
  interviewbit_url TEXT,
  other_url TEXT,
  primary_platform TEXT DEFAULT 'LeetCode',
  
  -- Problem Metadata
  tags TEXT[],
  companies TEXT[],
  acceptance_rate DECIMAL(5,2),
  frequency INTEGER DEFAULT 0,
  
  -- Additional Info
  is_premium BOOLEAN DEFAULT FALSE,
  video_solution_url TEXT,
  editorial_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(pattern_id, title),
  UNIQUE(pattern_id, display_order)
);

-- Create indexes for faster queries
CREATE INDEX idx_dsa_problems_pattern_id ON dsa_problems(pattern_id);
CREATE INDEX idx_dsa_problems_difficulty ON dsa_problems(difficulty);
CREATE INDEX idx_dsa_problems_display_order ON dsa_problems(pattern_id, display_order);
CREATE INDEX idx_dsa_problems_leetcode_number ON dsa_problems(leetcode_number) WHERE leetcode_number IS NOT NULL;
CREATE INDEX idx_dsa_problems_title ON dsa_problems USING gin(to_tsvector('english', title));

-- ============================================
-- TABLE 4: user_problem_progress
-- Tracks user progress for each problem
-- ============================================

CREATE TABLE user_problem_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
  
  -- Status Tracking
  status TEXT CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'SOLVED', 'REVIEWED')) DEFAULT 'NOT_STARTED',
  
  -- Revision Tracking (Spaced Repetition)
  first_solved_at TIMESTAMP WITH TIME ZONE,
  last_solved_at TIMESTAMP WITH TIME ZONE,
  revision_count INTEGER DEFAULT 0,
  next_revision_date DATE,
  
  -- Solution Details
  notes TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  approach TEXT,
  solution_code TEXT,
  
  -- Performance Metrics
  time_taken_minutes INTEGER,
  attempts_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, problem_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_user_problem_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX idx_user_problem_progress_problem_id ON user_problem_progress(problem_id);
CREATE INDEX idx_user_problem_progress_status ON user_problem_progress(user_id, status);
CREATE INDEX idx_user_problem_progress_next_revision ON user_problem_progress(user_id, next_revision_date) WHERE next_revision_date IS NOT NULL;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE dsa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsa_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_problem_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: dsa_categories
-- Allow all authenticated users to read categories
-- ============================================

CREATE POLICY "Allow authenticated users to read categories"
ON dsa_categories
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- RLS POLICIES: dsa_patterns
-- Allow all authenticated users to read patterns
-- ============================================

CREATE POLICY "Allow authenticated users to read patterns"
ON dsa_patterns
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- RLS POLICIES: dsa_problems
-- Allow all authenticated users to read problems
-- ============================================

CREATE POLICY "Allow authenticated users to read problems"
ON dsa_problems
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- RLS POLICIES: user_problem_progress
-- Users can only access their own progress
-- ============================================

CREATE POLICY "Users can view their own progress"
ON user_problem_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON user_problem_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_problem_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON user_problem_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_dsa_categories_updated_at
  BEFORE UPDATE ON dsa_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dsa_patterns_updated_at
  BEFORE UPDATE ON dsa_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dsa_problems_updated_at
  BEFORE UPDATE ON dsa_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_problem_progress_updated_at
  BEFORE UPDATE ON user_problem_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGERS: Auto-update problem counts
-- ============================================

-- Function to update pattern problem count
CREATE OR REPLACE FUNCTION update_pattern_problem_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE dsa_patterns
    SET problem_count = problem_count + 1
    WHERE id = NEW.pattern_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE dsa_patterns
    SET problem_count = problem_count - 1
    WHERE id = OLD.pattern_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pattern_count_on_problem_change
  AFTER INSERT OR DELETE ON dsa_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_pattern_problem_count();

-- Function to update category problem count
CREATE OR REPLACE FUNCTION update_category_problem_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE dsa_categories
    SET problem_count = problem_count + 1
    WHERE id = (SELECT category_id FROM dsa_patterns WHERE id = NEW.pattern_id);
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE dsa_categories
    SET problem_count = problem_count - 1
    WHERE id = (SELECT category_id FROM dsa_patterns WHERE id = OLD.pattern_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_count_on_problem_change
  AFTER INSERT OR DELETE ON dsa_problems
  FOR EACH ROW
  EXECUTE FUNCTION update_category_problem_count();

-- ============================================
-- VIEWS: Useful queries
-- ============================================

-- View: Complete hierarchy with counts
CREATE OR REPLACE VIEW dsa_hierarchy AS
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  c.display_order AS category_order,
  c.icon AS category_icon,
  c.problem_count AS category_problem_count,
  p.id AS pattern_id,
  p.name AS pattern_name,
  p.display_order AS pattern_order,
  p.difficulty_level,
  p.problem_count AS pattern_problem_count
FROM dsa_categories c
LEFT JOIN dsa_patterns p ON c.id = p.category_id
ORDER BY c.display_order, p.display_order;

-- View: User progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  user_id,
  COUNT(*) AS total_problems_attempted,
  COUNT(*) FILTER (WHERE status = 'SOLVED') AS problems_solved,
  COUNT(*) FILTER (WHERE status = 'REVIEWED') AS problems_reviewed,
  COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') AS problems_in_progress,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'SOLVED')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
    2
  ) AS completion_percentage
FROM user_problem_progress
GROUP BY user_id;

-- ============================================
-- FUNCTIONS: Useful utilities
-- ============================================

-- Function: Get user progress for a category
CREATE OR REPLACE FUNCTION get_user_category_progress(
  p_user_id UUID,
  p_category_id UUID
)
RETURNS TABLE (
  total_problems BIGINT,
  solved_problems BIGINT,
  completion_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(prob.id) AS total_problems,
    COUNT(prog.id) FILTER (WHERE prog.status = 'SOLVED') AS solved_problems,
    ROUND(
      (COUNT(prog.id) FILTER (WHERE prog.status = 'SOLVED')::DECIMAL / NULLIF(COUNT(prob.id), 0)) * 100,
      2
    ) AS completion_percentage
  FROM dsa_problems prob
  INNER JOIN dsa_patterns pat ON prob.pattern_id = pat.id
  LEFT JOIN user_problem_progress prog ON prob.id = prog.problem_id AND prog.user_id = p_user_id
  WHERE pat.category_id = p_category_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Get problems due for revision
CREATE OR REPLACE FUNCTION get_problems_due_for_revision(p_user_id UUID)
RETURNS TABLE (
  problem_id UUID,
  problem_title TEXT,
  pattern_name TEXT,
  category_name TEXT,
  next_revision_date DATE,
  days_overdue INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    prob.id,
    prob.title,
    pat.name,
    cat.name,
    prog.next_revision_date,
    (CURRENT_DATE - prog.next_revision_date)::INTEGER AS days_overdue
  FROM user_problem_progress prog
  INNER JOIN dsa_problems prob ON prog.problem_id = prob.id
  INNER JOIN dsa_patterns pat ON prob.pattern_id = pat.id
  INNER JOIN dsa_categories cat ON pat.category_id = cat.id
  WHERE prog.user_id = p_user_id
    AND prog.next_revision_date IS NOT NULL
    AND prog.next_revision_date <= CURRENT_DATE
  ORDER BY prog.next_revision_date ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS: Documentation
-- ============================================

COMMENT ON TABLE dsa_categories IS 'Main DSA pattern categories (15 total)';
COMMENT ON TABLE dsa_patterns IS 'Specific patterns within each category (93 total)';
COMMENT ON TABLE dsa_problems IS 'Individual coding problems (404 total)';
COMMENT ON TABLE user_problem_progress IS 'User progress tracking with spaced repetition';

COMMENT ON COLUMN dsa_problems.leetcode_slug IS 'URL-friendly slug for LeetCode problem';
COMMENT ON COLUMN user_problem_progress.next_revision_date IS 'Calculated using spaced repetition algorithm';
COMMENT ON COLUMN user_problem_progress.revision_count IS 'Number of times user has revised this problem';

-- ============================================
-- GRANTS: Permissions (if needed)
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select on all tables to authenticated users
GRANT SELECT ON dsa_categories TO authenticated;
GRANT SELECT ON dsa_patterns TO authenticated;
GRANT SELECT ON dsa_problems TO authenticated;

-- Grant all operations on user_problem_progress to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_problem_progress TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- END OF MIGRATION
-- ============================================

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE 'dsa_%'
ORDER BY table_name;
