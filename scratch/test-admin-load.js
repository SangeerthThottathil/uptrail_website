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

async function testAdminQueries() {
  console.log("Testing queries executed on Admin Dashboard page...");

  try {
    console.log("1. Fetching programmes...");
    const pRes = await supabase.from('programmes').select('*, programme_payment_options(*)');
    console.log("Programmes count:", pRes.data?.length, "Error:", pRes.error);

    console.log("2. Fetching applications...");
    const aRes = await supabase.from('programme_applications').select('*').eq('is_archived', false).order('created_at', { ascending: false });
    console.log("Applications count:", aRes.data?.length, "Error:", aRes.error);

    console.log("3. Fetching contact_submissions...");
    const cRes = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    console.log("Contact submissions count:", cRes.data?.length, "Error:", cRes.error);

    console.log("4. Fetching testimonials...");
    const tRes = await supabase.from('testimonials').select('*');
    console.log("Testimonials count:", tRes.data?.length, "Error:", tRes.error);

    console.log("5. Fetching posts...");
    const postRes = await supabase.from('posts').select('*');
    console.log("Posts count:", postRes.data?.length, "Error:", postRes.error);

    console.log("6. Fetching application summary...");
    const oldestDate = new Date();
    oldestDate.setDate(oldestDate.getDate() - 30);
    const summaryRes = await supabase.from('programme_applications').select('programme_title, created_at').gte('created_at', oldestDate.toISOString());
    console.log("Summary apps count:", summaryRes.data?.length, "Error:", summaryRes.error);

  } catch (err) {
    console.error("Test failed with error:", err);
  }
}

testAdminQueries().catch(console.error);
