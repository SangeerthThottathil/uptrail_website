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

async function debugTables() {
  console.log("=== SUPABASE DATABASE TABLE DEBUG ===");
  console.log("Using key prefix:", supabaseServiceKey ? supabaseServiceKey.substring(0, 15) + '...' : 'NONE');

  console.log("\n1. Testing insert into programme_applications...");
  const appObj = {
    id: `app_dbg_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'ai-data-analyst-career-programme',
    programme_title: 'AI Data Analyst Career Programme',
    name: 'Debug Test User',
    email: 'debugtest@example.com',
    phone: '+447000000000',
    message: '[Plan: Pay Monthly] Debug test message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data: appData, error: appErr } = await client.from('programme_applications').insert(appObj).select();
  console.log("programme_applications error:", appErr);
  console.log("programme_applications result:", appData);

  console.log("\n2. Testing insert into contact_submissions...");
  const msgObj = {
    id: `msg_dbg_${Date.now().toString(36)}`,
    source: 'contact',
    name: 'Debug Contact User',
    email: 'debugcontact@example.com',
    message: 'Debug contact message',
    read: false,
    created_at: new Date().toISOString(),
  };
  const { data: msgData, error: msgErr } = await client.from('contact_submissions').insert(msgObj).select();
  console.log("contact_submissions error:", msgErr);
  console.log("contact_submissions result:", msgData);

  console.log("\n3. Testing insert into hire_talent_submissions...");
  const hireObj = {
    id: `hire_dbg_${Date.now().toString(36)}`,
    name: 'Debug Hire User',
    company: 'Debug Corp',
    email: 'debughire@example.com',
    number_of_hires: '1-5',
    roles_hiring_for: 'Data Analyst',
    message: 'Debug hire message',
    status: 'new',
    created_at: new Date().toISOString(),
  };
  const { data: hireData, error: hireErr } = await client.from('hire_talent_submissions').insert(hireObj).select();
  console.log("hire_talent_submissions error:", hireErr);
  console.log("hire_talent_submissions result:", hireData);

  console.log("\n4. Testing insert into discovery_call_submissions...");
  const discObj = {
    id: `disc_dbg_${Date.now().toString(36)}`,
    name: 'Debug Disc User',
    company: 'Debug Corp',
    email: 'debugdisc@example.com',
    team_size: '10-50',
    training_area: 'Data',
    message: 'Debug disc message',
    status: 'new',
    created_at: new Date().toISOString(),
  };
  const { data: discData, error: discErr } = await client.from('discovery_call_submissions').insert(discObj).select();
  console.log("discovery_call_submissions error:", discErr);
  console.log("discovery_call_submissions result:", discData);
}

debugTables().catch(console.error);
