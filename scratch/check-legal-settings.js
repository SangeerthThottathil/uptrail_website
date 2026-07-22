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

  const { data, error } = await supabase.from('site_settings').select('*').eq('key', 'default').single();
  if (error) {
    console.error("Error fetching site_settings:", error);
    return;
  }

  console.log("privacyPolicyHtml:", data.general?.privacyPolicyHtml);
  console.log("termsHtml:", data.general?.termsHtml);
  console.log("privacy_policy_content:", data.general?.privacy_policy_content);
  console.log("terms_conditions_content:", data.general?.terms_conditions_content);
}

run().catch(console.error);
