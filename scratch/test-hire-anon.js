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

async function testHireAnon() {
  console.log("Testing insert with ANON KEY into hire_talent_submissions & discovery_call_submissions...");
  const hireObj = {
    id: `hire_anon_${Date.now().toString(36)}`,
    name: 'Anon Hire User',
    company: 'Acme',
    email: 'anonhire@example.com',
    number_of_hires: '1-5',
    roles_hiring_for: 'Data Analyst',
    message: 'Test hire message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data: d1, error: e1 } = await anonClient.from('hire_talent_submissions').insert(hireObj).select();
  console.log("Hire talent anon insert - error:", e1);

  const discoveryObj = {
    id: `disc_anon_${Date.now().toString(36)}`,
    name: 'Anon Discovery User',
    company: 'Acme',
    email: 'anondisc@example.com',
    team_size: '10-50',
    training_area: 'Data Analytics',
    message: 'Test discovery message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data: d2, error: e2 } = await anonClient.from('discovery_call_submissions').insert(discoveryObj).select();
  console.log("Discovery call anon insert - error:", e2);
}

testHireAnon().catch(console.error);
