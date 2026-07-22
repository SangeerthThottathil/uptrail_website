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
  console.log("Fine-tuning testimonial iframe heights in Supabase...");

  // Update Michael Sparks (ID 120) height to 510
  const quote120 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7355915511936827411?collapsed=1" height="510" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  const { error: error120 } = await supabase
    .from('testimonials')
    .update({ quote: quote120 })
    .eq('id', 120);
  console.log("Updated ID 120 result:", error120 ? error120 : "SUCCESS");

  // Update Samuel Rawlinson (ID 121) height to 485
  const quote121 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7342249938187173889?collapsed=1" height="485" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  const { error: error121 } = await supabase
    .from('testimonials')
    .update({ quote: quote121 })
    .eq('id', 121);
  console.log("Updated ID 121 result:", error121 ? error121 : "SUCCESS");

  // Update Evangelia Irakleidi (ID 122) height to 495
  const quote122 = '::iframe::<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7358102028545331201?collapsed=1" height="495" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>';
  const { error: error122 } = await supabase
    .from('testimonials')
    .update({ quote: quote122 })
    .eq('id', 122);
  console.log("Updated ID 122 result:", error122 ? error122 : "SUCCESS");

  // Verify
  const { data, error } = await supabase.from('testimonials').select('*');
  console.log("Testimonials updated schema:", data.map(t => ({ id: t.id, quote: t.quote })));
}

run().catch(console.error);
