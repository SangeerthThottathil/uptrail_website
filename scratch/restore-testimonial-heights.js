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
  console.log("Restoring original full testimonial heights to Supabase...");

  // ID 120 -> 566
  const quote120 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7355915511936827411?collapsed=1" height="566" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  await supabase.from('testimonials').update({ quote: quote120 }).eq('id', 120);

  // ID 121 -> 539
  const quote121 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7342249938187173889?collapsed=1" height="539" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  await supabase.from('testimonials').update({ quote: quote121 }).eq('id', 121);

  // ID 122 -> 542
  const quote122 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7358102028545331201?collapsed=1" height="542" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  await supabase.from('testimonials').update({ quote: quote122 }).eq('id', 122);

  console.log("Original heights restored.");
}

run().catch(console.error);
