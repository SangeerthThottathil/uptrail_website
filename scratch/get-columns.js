const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envText.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      env[key] = val;
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, serviceKey);

  // We can query the information_schema to see columns in site_settings
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'site_settings' });
  if (error) {
    // If rpc doesn't exist, we can use a direct sql query if there's a sql endpoint, or just do a select on columns.
    // Let's try running a direct query or checking columns via postgres query.
    // Wait, supabase-js doesn't allow raw SQL without RPC.
    // Let's query a non-existent column to see if it lists columns in the error, or query postgrest.
    console.error("RPC error (expected if get_table_columns does not exist):", error);
  } else {
    console.log("Columns:", data);
  }

  // Let's also do a select * and print the keys of the returned object
  const { data: row } = await supabase.from('site_settings').select('*').limit(1);
  if (row && row[0]) {
    console.log("Keys of site_settings row:", Object.keys(row[0]));
  }
}

run().catch(console.error);
