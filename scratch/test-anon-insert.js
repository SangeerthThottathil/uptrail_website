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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonInsert() {
  console.log("Testing insert with ANON KEY into programme_applications...");
  const insertObj = {
    id: `app_anon_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'data-analytics-career-accelerator',
    programme_title: 'Data Analytics Career Accelerator',
    name: 'Anon Test User',
    email: 'anontest@example.com',
    phone: '+44 7000000000',
    experience: '',
    availability: '',
    message: '[Plan: Upfront Payment]\nTest anon insert',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await anonClient.from('programme_applications').insert(insertObj).select();
  console.log("Anon insert status - error:", error);
  console.log("Anon insert status - data:", data);
}

testAnonInsert().catch(console.error);
