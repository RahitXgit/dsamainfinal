import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing environment variables!')
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
    console.log('🚀 Starting Database Setup...\n')

    try {
        // Read and execute schema SQL
        console.log('📋 Step 1: Creating tables...')
        const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_dsa_patterns_schema.sql')
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8')

        // Execute schema (note: this requires direct SQL execution)
        console.log('⚠️  Please run the schema SQL file manually in Supabase SQL Editor:')
        console.log('   File: supabase/migrations/001_dsa_patterns_schema.sql\n')

        // Read and execute seed SQL for categories and patterns
        console.log('📋 Step 2: Seeding categories and patterns...')
        const seedPath = path.join(__dirname, '..', 'supabase', 'migrations', '002_dsa_seed_categories_patterns.sql')
        const seedSql = fs.readFileSync(seedPath, 'utf-8')

        console.log('⚠️  Please run the seed SQL file manually in Supabase SQL Editor:')
        console.log('   File: supabase/migrations/002_dsa_seed_categories_patterns.sql\n')

        console.log('✅ Manual SQL files ready!')
        console.log('\n📝 Next Steps:')
        console.log('1. Go to Supabase Dashboard → SQL Editor')
        console.log('2. Run: supabase/migrations/001_dsa_patterns_schema.sql')
        console.log('3. Run: supabase/migrations/002_dsa_seed_categories_patterns.sql')
        console.log('4. Then run: npm run seed:problems')

    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

setupDatabase()
