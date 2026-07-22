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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing service role credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Checking programme_payment_options table structure and contents...");
  
  const { data: colsData, error: colCheck } = await supabase
    .from('programme_payment_options')
    .select('is_highlighted')
    .limit(1);
    
  console.log("colCheck error:", colCheck);
  console.log("colCheck data:", colsData);

  const { data: rows, error: selectErr } = await supabase
    .from('programme_payment_options')
    .select('*');

  console.log("All rows in programme_payment_options:", rows, selectErr);
}

run();
