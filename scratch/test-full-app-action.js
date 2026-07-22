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

async function verify() {
  console.log("Testing direct database insert with updated logic...");
  const insertObj = {
    id: `app_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'data-analytics-career-accelerator',
    programme_title: 'Data Analytics Career Accelerator',
    name: 'Verification User',
    email: 'verification@example.com',
    phone: '+44 7000000000',
    experience: '',
    availability: '',
    message: '[Plan: Upfront Payment]\nTest verification message',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('programme_applications').insert(insertObj).select();
  console.log("Inserted row data:", data);
  console.log("Error:", error);
}

verify().catch(console.error);
