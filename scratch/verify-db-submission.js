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

async function checkLatestSubmission() {
  console.log("Querying latest row in programme_applications...");
  const { data, error } = await supabase
    .from('programme_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest application:", error);
  } else {
    console.log("Latest application record:", JSON.stringify(data[0], null, 2));
  }
}

checkLatestSubmission().catch(console.error);
