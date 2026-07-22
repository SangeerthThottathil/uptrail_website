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

// UNSET SUPABASE_SERVICE_ROLE_KEY to simulate missing env var in Netlify context
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

const { getServiceRoleClient } = require('../lib/supabase');

try {
  console.log("Calling getServiceRoleClient() without SUPABASE_SERVICE_ROLE_KEY...");
  getServiceRoleClient();
} catch (err) {
  console.error("ACTUAL ERROR:", err.message);
  console.error("STACK TRACE:", err.stack);
}
