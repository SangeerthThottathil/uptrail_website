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

async function runTest() {
  const slug = 'ai-data-analyst-career-programme';

  // Check if is_highlighted column exists
  let hasIsHighlighted = false;
  try {
    const { error: colCheck } = await supabase
      .from('programme_payment_options')
      .select('is_highlighted')
      .limit(1);
    if (!colCheck) {
      hasIsHighlighted = true;
    }
  } catch (e) {}

  console.log("hasIsHighlighted in DB:", hasIsHighlighted);

  // 1. Prepare payment options: option #0 is highlighted, option #1 is NOT highlighted
  const paymentOptions = [
    {
      pillText: 'Pay upfront',
      title: 'Full Tuition',
      description: 'Pay full tuition upfront and save.',
      bulletPoints: ['Discount included', 'Full access'],
      buttonLabel: 'Enroll Now',
      icon: 'Wallet',
      isHighlighted: true
    },
    {
      pillText: 'Monthly plan',
      title: 'Installment Plan',
      description: 'Spread the cost over 6 months.',
      bulletPoints: ['Flexible payments', 'No interest'],
      buttonLabel: 'Apply Now',
      icon: 'CreditCard',
      isHighlighted: false
    }
  ];

  // Save logic replica
  await supabase.from('programme_payment_options').delete().eq('programme_slug', slug);

  const highlightedIndex = paymentOptions.findIndex((o) => !!o.isHighlighted);

  const rows = paymentOptions.map((o, idx) => {
    const isOptHighlighted = idx === highlightedIndex;
    let finalPillText = (o.pillText || '').replace(/::highlighted$/, '');
    if (!hasIsHighlighted && isOptHighlighted) {
      finalPillText = `${finalPillText}::highlighted`;
    }

    const row = {
      programme_slug: slug,
      pill_text: finalPillText,
      title: o.title,
      description: o.description,
      bullet_points: o.bulletPoints,
      button_label: o.buttonLabel,
      icon: o.icon || 'Wallet',
      redirect_url: o.redirectUrl || '',
      display_order: idx,
    };
    if (hasIsHighlighted) {
      row.is_highlighted = isOptHighlighted;
    }
    return row;
  });

  const { error: insErr } = await supabase.from('programme_payment_options').insert(rows);
  if (insErr) {
    console.error("Insert error:", insErr);
    return;
  }
  console.log("Saved rows successfully.");

  // Fetch back from DB replica
  const { data: dbRows, error: selErr } = await supabase
    .from('programme_payment_options')
    .select('*')
    .eq('programme_slug', slug)
    .order('display_order', { ascending: true });

  if (selErr) {
    console.error("Select error:", selErr);
    return;
  }

  console.log("Raw fetched DB rows:", dbRows);

  // Map back replica
  const mappedOptions = dbRows.map((o) => {
    let rawPillText = o.pill_text || '';
    const hasMarker = rawPillText.endsWith('::highlighted');
    const pillText = hasMarker ? rawPillText.replace(/::highlighted$/, '') : rawPillText;
    const isHighlighted = !!o.is_highlighted || hasMarker;

    return {
      id: o.id,
      pillText,
      title: o.title || '',
      description: o.description || '',
      bulletPoints: o.bullet_points || [],
      buttonLabel: o.button_label || '',
      icon: o.icon || 'Wallet',
      redirectUrl: o.redirect_url || '',
      isHighlighted,
    };
  });

  console.log("\nMapped Options Result:\n", JSON.stringify(mappedOptions, null, 2));

  const highlightedCards = mappedOptions.filter(o => o.isHighlighted);
  if (highlightedCards.length === 1 && mappedOptions[0].isHighlighted && mappedOptions[0].pillText === 'Pay upfront') {
    console.log("\n==================================================================");
    console.log("TEST SUCCESS! Card #0 is highlighted, pillText is clean ('Pay upfront'), and exactly 1 card is highlighted!");
    console.log("==================================================================");
  } else {
    console.error("TEST FAILED!");
  }
}

runTest().catch(console.error);
