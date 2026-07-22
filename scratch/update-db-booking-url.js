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

  const updatedGeneral = {
    ...data.general,
    booking_widget_url: "https://uptrailltd.zohobookings.eu/portal-embed#/242257000000040052"
  };

  const { error: updateError } = await supabase.from('site_settings').upsert({
    key: 'default',
    general: updatedGeneral,
    contact: data.contact,
    announcement: data.announcement,
    header: data.header,
    footer: data.footer,
    social: data.social,
    updated_at: new Date().toISOString()
  });

  if (updateError) {
    console.error("Error updating site_settings:", updateError);
    return;
  }

  console.log("Database updated successfully with booking_widget_url!");
}

run().catch(console.error);
