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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };

  try {
    const res = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS body_content TEXT;' })
    });
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${await res.text()}`);
  } catch (e) {
    console.error("Error:", e.message);
  }
}

run().catch(console.error);
