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
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthLogin() {
  console.log("Testing sign in with password for admin@uptrail.co ...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@uptrail.co',
    password: 'AdminPassword123!',
  });

  if (error) {
    console.error("Sign in failed:", error.message);
  } else {
    console.log("Sign in SUCCESSFUL!");
    console.log("User ID:", data.user.id);
    console.log("User Email:", data.user.email);
  }
}

testAuthLogin().catch(console.error);
