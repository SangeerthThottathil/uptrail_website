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
// We need service client since setSuccessStories uses getServiceRoleClient()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing service role credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const items = [
  {
    name: 'Maya Thompson',
    fromRole: 'Barista',
    toRole: 'Data Analyst at Monzo',
    story: 'Maya joined our Data Analytics programme with zero technical background. Within four months of graduating she landed her first analyst role and has since been promoted twice.',
    isFeatured: true,
    featuredTitle: 'How Maya went from barista to data analyst.',
  },
  {
    name: 'Daniel Wright',
    fromRole: 'Admin assistant',
    toRole: 'Business Analyst at HSBC',
    story: 'Daniel used the portfolio he built on the Business Analysis bootcamp to walk into interviews with proof of his skills — and three competing offers.',
    isFeatured: false,
    featuredTitle: 'How Daniel went from admin assistant to business analyst.',
  }
];

async function run() {
  try {
    console.log("Deleting existing...");
    const { error: delError } = await supabase.from('success_stories').delete().neq('id', 0);
    if (delError) {
      console.error("Delete error:", delError);
      return;
    }

    console.log("Inserting items...");
    for (let i = 0; i < items.length; i++) {
      const s = items[i];
      const payload = {
        name: s.name,
        from_role: s.fromRole,
        to_role: s.toRole,
        story: s.story,
        is_featured: s.isFeatured || false,
        featured_title: s.featuredTitle || '',
        display_order: i,
      };
      console.log(`Inserting item ${i}:`, payload);
      const { error: insError } = await supabase.from('success_stories').insert(payload);
      if (insError) {
        console.error("Insert error:", insError);
      }
    }
    console.log("Done!");
  } catch (err) {
    console.error("Caught error:", err);
  }
}

run();
