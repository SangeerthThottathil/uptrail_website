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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key present?", !!supabaseAnonKey);
console.log("Supabase Service Key present?", !!supabaseServiceKey);

const store = require('../lib/store/store');

async function testAllSteps() {
  console.log("\n--- STEP 1: Fetching programme ---");
  try {
    const programme = await store.getProgramme('data-analytics-career-accelerator');
    console.log("Programme loaded:", programme ? programme.title : 'null');
    console.log("Programme track:", programme?.track);
    console.log("Programme paymentOptions:", programme?.paymentOptions);
  } catch (err) {
    console.error("Step 1 ERROR:", err);
  }

  console.log("\n--- STEP 2: Adding application ---");
  try {
    await store.addApplication({
      track: 'career',
      programmeSlug: 'data-analytics-career-accelerator',
      programmeTitle: 'Data Analytics Career Accelerator',
      name: 'Step Test User',
      email: 'steptest@example.com',
      phone: '+44 7123456789',
      message: '',
      paymentPlan: 'Upfront Payment'
    });
    console.log("Add application SUCCESS!");
  } catch (err) {
    console.error("Step 2 ERROR:", err);
  }

  console.log("\n--- STEP 3: Getting settings ---");
  try {
    const settings = await store.getSettings();
    console.log("Settings loaded:", settings ? "YES" : "NO");
    console.log("General settings:", settings?.general);
  } catch (err) {
    console.error("Step 3 ERROR:", err);
  }
}

testAllSteps().catch(console.error);
