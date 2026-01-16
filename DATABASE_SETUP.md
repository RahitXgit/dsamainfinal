# DSA Patterns Database Setup Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Database Tables

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_dsa_patterns_schema.sql`
4. Click **Run**
5. Wait for "Success" message

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### Step 3: Seed Categories and Patterns

In Supabase SQL Editor:
1. Copy and paste the contents of `supabase/migrations/002_dsa_seed_categories_patterns.sql`
2. Click **Run**
3. Verify: You should see 15 categories and 93 patterns

### Step 4: Seed All 404 Problems

Run the TypeScript seed script:
```bash
npm run seed:problems
```

This will:
- Connect to your Supabase database
- Insert all 404 problems with auto-generated LeetCode links
- Show progress every 50 problems
- Display final statistics

---

## Verification

After seeding, verify in Supabase:

```sql
-- Check counts
SELECT 
  'Categories' AS table_name, 
  COUNT(*) AS count 
FROM dsa_categories
UNION ALL
SELECT 
  'Patterns' AS table_name, 
  COUNT(*) AS count 
FROM dsa_patterns
UNION ALL
SELECT 
  'Problems' AS table_name, 
  COUNT(*) AS count 
FROM dsa_problems;
```

Expected results:
- Categories: 15
- Patterns: 93
- Problems: 404

---

## Troubleshooting

### Error: "supabaseUrl is required"
- Make sure `.env.local` exists with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

### Error: "relation does not exist"
- Run the schema SQL file first (Step 2)

### Error: "foreign key violation"
- Run the category/pattern seed file before problems (Step 3 before Step 4)

---

## File Structure

```
dsa-tracker/
├── supabase/
│   └── migrations/
│       ├── 001_dsa_patterns_schema.sql      # Creates tables
│       └── 002_dsa_seed_categories_patterns.sql  # Seeds categories/patterns
├── scripts/
│   ├── setupDatabase.ts                     # Setup helper
│   └── seedDSAProblems.ts                   # Seeds all 404 problems
└── .env.local                               # Your credentials
```

---

## Manual Cleanup (if needed)

To start fresh:

```sql
-- Drop all tables
DROP TABLE IF EXISTS user_problem_progress CASCADE;
DROP TABLE IF EXISTS dsa_problems CASCADE;
DROP TABLE IF EXISTS dsa_patterns CASCADE;
DROP TABLE IF EXISTS dsa_categories CASCADE;
```

Then re-run Steps 2-4.
