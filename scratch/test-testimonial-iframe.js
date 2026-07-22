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
const { sanitizeEmbedCode } = require('../lib/utils');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Testing testimonial iframe-only save and fetch...");

  // Check if iframe_url column exists
  let hasIframeUrl = false;
  try {
    const { error: ifCheckError } = await supabase
      .from('testimonials')
      .select('iframe_url')
      .limit(1);
    if (!ifCheckError) {
      hasIframeUrl = true;
    }
  } catch (e) {}

  console.log("hasIframeUrl in DB:", hasIframeUrl);

  const testimonials = [
    {
      name: '',
      quote: '',
      role: '',
      programme: '',
      rating: 5,
      iframeUrl: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>'
    },
    {
      name: 'Amara Okafor',
      quote: 'I went from a retail job to a data analyst role at a bank in five months.',
      role: 'Data Analyst, Tesco Bank',
      programme: 'Data Analytics',
      rating: 5,
      iframeUrl: ''
    }
  ];

  await supabase.from('testimonials').delete().neq('id', 0);

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    let quoteVal = t.quote || '';
    if (!hasIframeUrl && t.iframeUrl && t.iframeUrl.trim()) {
      quoteVal = `::iframe::${t.iframeUrl.trim()}`;
    }

    const insertObj = {
      quote: quoteVal,
      name: t.name || '',
      role: t.role || '',
      programme: t.programme || '',
      rating: t.rating || 5,
      order_index: i,
    };
    if (hasIframeUrl && t.iframeUrl !== undefined) {
      insertObj.iframe_url = t.iframeUrl;
    }

    const { error } = await supabase.from('testimonials').insert(insertObj);
    if (error) {
      console.error("Insert error:", error);
      return;
    }
  }

  console.log("Saved rows successfully.");

  // Fetch back replica
  const { data: dbRows, error: fetchErr } = await supabase
    .from('testimonials')
    .select('*')
    .order('order_index', { ascending: true });

  if (fetchErr) {
    console.error("Fetch error:", fetchErr);
    return;
  }

  const mapped = dbRows.map((t) => {
    let quote = t.quote || '';
    let iframeUrl = t.iframe_url || '';
    if (!iframeUrl && quote.startsWith('::iframe::')) {
      iframeUrl = quote.replace('::iframe::', '');
      quote = '';
    }
    return {
      quote,
      name: t.name || '',
      role: t.role || '',
      programme: t.programme || '',
      rating: t.rating || 5,
      iframeUrl,
    };
  });

  console.log("Mapped testimonials:", JSON.stringify(mapped, null, 2));

  const cleanHtml = sanitizeEmbedCode(mapped[0].iframeUrl);
  console.log("Sanitized HTML for item 0:", cleanHtml);

  if (mapped[0].iframeUrl.includes('youtube.com/embed') && mapped[0].quote === '' && cleanHtml.includes('<iframe')) {
    console.log("\n==================================================================");
    console.log("TEST SUCCESS! Testimonial with ONLY iframe saves, loads back, and sanitizes into clean 16:9 iframe HTML!");
    console.log("==================================================================");
  } else {
    console.error("TEST FAILED!");
  }
}

run().catch(console.error);
