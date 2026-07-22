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

async function testContactAnon() {
  console.log("Testing insert with ANON KEY into contact_submissions...");
  const insertObj = {
    id: `msg_anon_${Date.now().toString(36)}`,
    source: 'contact',
    name: 'Anon Contact User',
    email: 'anoncontact@example.com',
    fields: {},
    message: 'Test contact message',
    read: false,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await anonClient.from('contact_submissions').insert(insertObj).select();
  console.log("Contact anon insert - error:", error);
  console.log("Contact anon insert - data:", data);
}

testContactAnon().catch(console.error);
