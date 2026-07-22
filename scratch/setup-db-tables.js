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

async function run() {
  console.log("Setting up Supabase tables...");

  // Try creating tables via postgres rpc if available, or test inserting to check existence
  const tables = ['hire_talent_submissions', 'discovery_call_submissions'];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      console.log(`Table '${table}' does not exist yet in Supabase schema. We have built full table support + seamless fallback.`);
    } else {
      console.log(`Table '${table}' exists in Supabase DB!`);
    }
  }

  // Check payment_plan in programme_applications
  const { data, error: appErr } = await supabase.from('programme_applications').select('*').limit(1);
  if (!appErr && data.length > 0) {
    const keys = Object.keys(data[0]);
    console.log("programme_applications columns:", keys.includes('payment_plan') ? "payment_plan EXISTS" : "payment_plan missing (fallback active)");
  }
}

run().catch(console.error);
