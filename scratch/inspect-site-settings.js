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
  if (!url || !serviceKey) {
    console.error("Missing env vars in parsed .env.local", env);
    return;
  }
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from('site_settings').select('*').eq('key', 'default').single();
  if (error) {
    console.error("Error fetching site_settings:", error);
    return;
  }
  console.log("Current site_settings data:", JSON.stringify(data, null, 2));
}

run().catch(console.error);
