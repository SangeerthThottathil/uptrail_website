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

async function testContactInsert() {
  console.log("Testing contact_submissions insert with fields = {}...");
  const insertObj = {
    id: `msg_test_${Date.now().toString(36)}`,
    source: 'contact',
    name: 'Verified Contact User',
    email: 'verifiedcontact@example.com',
    fields: {},
    message: 'Test message',
    read: false,
    created_at: new Date().toISOString(),
  };

  const { error } = await client.from('contact_submissions').insert(insertObj);
  console.log("Contact insert result error:", error);
}

testContactInsert().catch(console.error);
