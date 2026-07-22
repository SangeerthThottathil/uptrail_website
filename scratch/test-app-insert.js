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

async function testInsert() {
  const insertObj = {
    id: `app_test_${Date.now()}`,
    track: 'career',
    programme_slug: 'data-analytics-career-accelerator',
    programme_title: 'Data Analytics Career Accelerator',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+44 123456789',
    experience: '',
    availability: '',
    message: '',
    status: 'new',
    created_at: new Date().toISOString(),
    payment_plan: 'Upfront'
  };

  console.log("Attempting insert with payment_plan...");
  const { data, error } = await supabase.from('programme_applications').insert(insertObj);
  console.log("Error object:", error);
}

testInsert().catch(console.error);
