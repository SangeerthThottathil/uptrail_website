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

async function testWithFallbacks() {
  console.log("=== TESTING INSERT WITH NOT-NULL FALLBACK VALUES ===");

  console.log("\n1. Inserting into programme_applications with default empty strings/json for experience, goals, fields...");
  const appObj = {
    id: `app_fix_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'ai-data-analyst-career-programme',
    programme_title: 'AI Data Analyst Career Programme',
    name: 'Fix Test User',
    email: 'fixtest@example.com',
    phone: '+447000000000',
    experience: '',
    goals: '',
    message: '[Plan: Pay Monthly] Fix test message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data: appData, error: appErr } = await client.from('programme_applications').insert(appObj).select();
  console.log("programme_applications error:", appErr);
  console.log("programme_applications result:", appData);

  console.log("\n2. Inserting into contact_submissions with fields = {}...");
  const msgObj = {
    id: `msg_fix_${Date.now().toString(36)}`,
    source: 'contact',
    name: 'Fix Contact User',
    email: 'fixcontact@example.com',
    fields: {},
    message: 'Fix contact message',
    read: false,
    created_at: new Date().toISOString(),
  };
  const { data: msgData, error: msgErr } = await client.from('contact_submissions').insert(msgObj).select();
  console.log("contact_submissions error:", msgErr);
  console.log("contact_submissions result:", msgData);
}

testWithFallbacks().catch(console.error);
