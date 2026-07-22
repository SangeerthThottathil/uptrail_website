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

async function testSubmit() {
  console.log("--- Testing Application Submission Database Insert ---");
  const testData = {
    id: `app_${Date.now().toString(36)}`,
    track: 'career',
    programme_slug: 'data-analytics-career-accelerator',
    programme_title: 'Data Analytics Career Accelerator',
    name: 'Test Applicant',
    email: 'test@example.com',
    phone: '+44 7123456789',
    experience: '',
    availability: '',
    message: '[Plan: Upfront Payment]\n',
    status: 'new',
    created_at: new Date().toISOString(),
    payment_plan: 'Upfront Payment'
  };

  console.log("Attempting insert with payment_plan column...");
  const res1 = await supabase.from('programme_applications').insert(testData).select();
  console.log("Result 1:", JSON.stringify(res1, null, 2));

  if (res1.error) {
    console.log("Retrying without payment_plan column...");
    delete testData.payment_plan;
    const res2 = await supabase.from('programme_applications').insert(testData).select();
    console.log("Result 2:", JSON.stringify(res2, null, 2));
  }
}

testSubmit().catch(console.error);
