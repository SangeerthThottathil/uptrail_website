const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const envText = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  envText.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      env[key] = val;
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, serviceKey);

  const { data, error } = await supabase.from('site_settings').select('*').eq('key', 'default').single();
  if (error) {
    console.error("Error fetching site_settings:", error);
    return;
  }

  const samplePrivacy = `
<h2>1. Information We Collect</h2>
<p>We collect personal information that you provide to us directly when you fill out forms, request consultations, or enrol in our career programmes.</p>
<ul>
  <li><strong>Contact Details:</strong> Full name, email address, phone number.</li>
  <li><strong>Career Information:</strong> Employment history, education, career goals.</li>
  <li><strong>Usage Data:</strong> Pages visited, interaction with website features.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>Your data allows us to provide personalised career advice, deliver our educational programmes, and improve our services.</p>
<blockquote>We never sell your personal information to third parties.</blockquote>

<h2>3. Contact Us</h2>
<p>If you have any questions about this privacy notice, please contact our data privacy officer at <a href="mailto:contact@uptrail.co.uk">contact@uptrail.co.uk</a>.</p>
`.trim();

  const sampleTerms = `
<h2>1. Overview</h2>
<p>These Terms &amp; Conditions govern your participation in all Uptrail career programmes, bootcamps, and workshops.</p>

<h2>2. Admission &amp; Enrolment</h2>
<p>Enrolment in any programme is subject to availability and completion of the application process.</p>
<ul>
  <li>Applicants must meet all prerequisite requirements specified for the track.</li>
  <li>Payment options must be selected and confirmed prior to the cohort start date.</li>
</ul>

<h2>3. Cancellations &amp; Refunds</h2>
<p>You may cancel your enrolment up to 14 days before the scheduled cohort start date for a full refund.</p>
`.trim();

  const updatedGeneral = {
    ...data.general,
    privacy_policy_content: samplePrivacy,
    privacyPolicyHtml: samplePrivacy,
    terms_conditions_content: sampleTerms,
    termsHtml: sampleTerms,
  };

  const { error: updateError } = await supabase.from('site_settings').upsert({
    key: 'default',
    general: updatedGeneral,
    contact: data.contact,
    announcement: data.announcement,
    header: data.header,
    footer: data.footer,
    social: data.social,
    updated_at: new Date().toISOString()
  });

  if (updateError) {
    console.error("Error updating site_settings with legal content:", updateError);
    return;
  }

  console.log("Database updated successfully with default formatted legal content!");
}

run().catch(console.error);
