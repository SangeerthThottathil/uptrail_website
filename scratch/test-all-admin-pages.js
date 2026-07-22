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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAll() {
  console.log("Testing all tables and queries used by admin panel...");

  const tables = [
    'programmes',
    'programme_payment_options',
    'programme_applications',
    'contact_submissions',
    'hire_talent_submissions',
    'discovery_call_submissions',
    'testimonials',
    'success_stories',
    'video_testimonials',
    'employers',
    'stats',
    'posts',
    'site_settings'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`Table '${table}': ERROR [${error.code}] ${error.message}`);
      } else {
        console.log(`Table '${table}': EXISTS (${count} rows)`);
      }
    } catch (e) {
      console.log(`Table '${table}': EXCEPTION ${e.message}`);
    }
  }
}

testAll().catch(console.error);
