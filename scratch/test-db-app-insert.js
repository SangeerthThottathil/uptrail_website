const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(supabaseUrl, supabaseServiceKey);

async function testAppInsert() {
  console.log("Testing programme_applications insert with experience = '' and availability = ''...");
  const appObj = {
    id: `app_fix_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'ai-data-analyst-career-programme',
    programme_title: 'AI Data Analyst Career Programme',
    name: 'Fix Test User',
    email: 'fixtest@example.com',
    phone: '+447000000000',
    experience: '',
    availability: '',
    message: '[Plan: Pay Monthly] Fix test message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await client.from('programme_applications').insert(appObj).select();
  console.log("programme_applications insert - error:", error);
  console.log("programme_applications insert - result:", data);
}

testAppInsert().catch(console.error);
