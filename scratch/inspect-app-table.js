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

async function run() {
  console.log("Checking programme_applications table in Supabase...");

  // Select 1 row to see returned columns
  const { data, error } = await supabase
    .from('programme_applications')
    .select('*')
    .limit(5);

  if (error) {
    console.error("Error querying programme_applications:", error);
    return;
  }

  console.log("Sample rows count:", data.length);
  if (data.length > 0) {
    console.log("Columns returned in sample row:", Object.keys(data[0]));
    console.log("Sample row data:", JSON.stringify(data[0], null, 2));
  } else {
    // Try to query specifically payment_plan column to test existence
    const { error: colError } = await supabase
      .from('programme_applications')
      .select('payment_plan')
      .limit(1);

    if (colError) {
      console.log("payment_plan column test result: ERROR ->", colError.message, colError.code);
    } else {
      console.log("payment_plan column test result: EXISTS in DB!");
    }
  }
}

run().catch(console.error);
