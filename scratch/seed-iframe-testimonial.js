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
  console.log("Seeding test testimonials including an iframe-only testimonial...");

  const items = [
    {
      name: '',
      quote: '',
      role: '',
      programme: '',
      rating: 5,
      is_featured: false,
      featured_title: '',
      image: '',
      // We encode in quote since iframe_url column is missing in DB
      quote: '::iframe::<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
      order_index: 0
    },
    {
      name: 'Amara Okafor',
      quote: 'I went from a retail job to a data analyst role at a bank in five months.',
      role: 'Data Analyst, Tesco Bank',
      programme: 'Data Analytics',
      rating: 5,
      order_index: 1
    },
    {
      name: 'Daniel Wright',
      quote: 'The portfolio projects were exactly what interviewers wanted to talk about.',
      role: 'Business Analyst, HSBC',
      programme: 'Business Analysis',
      rating: 5,
      order_index: 2
    }
  ];

  await supabase.from('testimonials').delete().neq('id', 0);
  const { error } = await supabase.from('testimonials').insert(items);
  if (error) {
    console.error("Error inserting:", error);
    return;
  }
  console.log("Testimonials seeded successfully!");
}

run().catch(console.error);
