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

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function testAddApplication() {
  const input = {
    track: 'career',
    programmeSlug: 'data-analytics-career-accelerator',
    programmeTitle: 'Data Analytics Career Accelerator',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+44 7123456789',
    message: '',
    paymentPlan: 'Upfront Payment',
  };

  const insertObj = {
    id: id('app'),
    track: input.track,
    programme_slug: input.programmeSlug,
    programme_title: input.programmeTitle,
    name: input.name,
    email: input.email,
    phone: input.phone,
    experience: '',
    availability: '',
    message: input.message,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (input.paymentPlan) {
    insertObj.payment_plan = input.paymentPlan;
  }

  console.log("Initial insertObj:", insertObj);

  const { error } = await supabase.from('programme_applications').insert(insertObj);
  console.log("First insert error:", error);

  if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message.includes('payment_plan'))) {
    delete insertObj.payment_plan;
    if (input.paymentPlan) {
      insertObj.message = `[Plan: ${input.paymentPlan}]\n${insertObj.message || ''}`.trim();
    }
    console.log("Retry insertObj:", insertObj);
    const { data: retryData, error: retryError } = await supabase.from('programme_applications').insert(insertObj).select();
    console.log("Retry result data:", retryData);
    console.log("Retry result error:", retryError);
  }
}

testAddApplication().catch(console.error);
