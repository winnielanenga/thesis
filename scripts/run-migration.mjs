// Temporary script to run the UUID -> TEXT migration
// This uses the Supabase REST API to execute SQL

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runMigration() {
    const sql = `
        -- Check current column types first
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'id';
    `;

    const alterSql = `
        BEGIN;
        
        -- Drop foreign key constraints first
        ALTER TABLE user_milestones DROP CONSTRAINT IF EXISTS user_milestones_user_id_fkey;
        ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
        
        -- Change the column type from UUID to TEXT in all affected tables
        ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
        ALTER TABLE user_milestones ALTER COLUMN user_id TYPE TEXT;
        ALTER TABLE tasks ALTER COLUMN user_id TYPE TEXT;
        
        -- Recreate foreign key constraints with CASCADE delete
        ALTER TABLE user_milestones 
        ADD CONSTRAINT user_milestones_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        ALTER TABLE tasks 
        ADD CONSTRAINT tasks_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
        
        COMMIT;
    `;

    // Use the Supabase PostgREST SQL endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ query: alterSql }),
    });

    if (!response.ok) {
        // exec_sql function might not exist, let's try direct approach
        console.log('exec_sql RPC not available, trying alternative...');

        // We need to use the Supabase Management API instead
        // Extract project ref from URL
        const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
        console.log('Project ref:', projectRef);
        console.log('Please run the following SQL in Supabase SQL Editor:');
        console.log(alterSql);
        return;
    }

    const result = await response.json();
    console.log('Migration result:', result);
}

runMigration().catch(console.error);
