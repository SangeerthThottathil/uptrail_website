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

async function testEndpoints() {
  const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    '/pg/query',
    '/pg/tables',
    '/rest/v1/',
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${url}${ep}`, {
        method: ep.includes('query') ? 'POST' : 'GET',
        headers,
        body: ep.includes('query') ? JSON.stringify({ query: 'ALTER TABLE programme_payment_options ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;' }) : undefined
      });
      console.log(`Endpoint ${ep}: status ${res.status}`, await res.text());
    } catch(e) {
      console.log(`Endpoint ${ep} error:`, e.message);
    }
  }
}

testEndpoints();
