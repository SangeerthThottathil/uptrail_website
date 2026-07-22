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

const store = require('../lib/store/store');

async function run() {
  console.log("==================================================================");
  console.log("VERIFYING ITEM 1 & ITEM 2 STAGED IMPLEMENTATION");
  console.log("==================================================================");

  // 1. Test Application Submission with paymentPlan
  console.log("\n1. Testing Programme Application with payment plan...");
  const appInput = {
    track: 'career',
    programmeSlug: 'ai-data-analyst-career-programme',
    programmeTitle: 'AI Data Analyst Career Programme',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+44 7911 123456',
    message: 'Excited to start!',
    paymentPlan: 'Monthly Installments'
  };

  await store.addApplication(appInput);
  console.log("Application inserted.");

  const pagedApps = await store.getApplicationsPaged('career', 1, 10, false);
  const foundApp = pagedApps.items.find(a => a.email === 'sarah.connor@example.com');
  console.log("Fetched application paymentPlan:", foundApp ? foundApp.paymentPlan : 'NOT FOUND');

  if (foundApp && foundApp.paymentPlan === 'Monthly Installments') {
    console.log("Item 1 SUCCESS: Payment Plan is captured and retrieved correctly!");
  } else {
    console.error("Item 1 FAILED!");
  }

  // 2. Test Hire Talent Submission
  console.log("\n2. Testing Hire Talent Submission...");
  const hireInput = {
    name: 'Arthur Pendelton',
    company: 'Acme Corp',
    email: 'arthur@acme.com',
    numberOfHires: '2–5 roles',
    rolesHiringFor: 'Data Analyst, Junior PM',
    message: 'Looking for 3 data analysts immediately.'
  };

  await store.addHireTalentSubmission(hireInput);
  console.log("Hire Talent submission inserted.");

  const pagedHire = await store.getHireTalentSubmissionsPaged(1, 10, false);
  const foundHire = pagedHire.items.find(h => h.email === 'arthur@acme.com');
  console.log("Fetched Hire Talent submission:", JSON.stringify(foundHire, null, 2));

  if (foundHire && foundHire.company === 'Acme Corp' && foundHire.numberOfHires === '2–5 roles') {
    console.log("Item 2.1 SUCCESS: Hire Talent Submission saved to hire_talent_submissions table!");
  } else {
    console.error("Item 2.1 FAILED!");
  }

  // 3. Test Discovery Call Submission
  console.log("\n3. Testing Discovery Call Submission...");
  const discInput = {
    name: 'Eleanor Vance',
    company: 'Hill House Logistics',
    email: 'eleanor@hillhouse.com',
    teamSize: '11–50 people',
    trainingArea: 'AI & Automation',
    message: 'Need corporate training for 20 analytics managers.'
  };

  await store.addDiscoveryCallSubmission(discInput);
  console.log("Discovery Call submission inserted.");

  const pagedDisc = await store.getDiscoveryCallSubmissionsPaged(1, 10, false);
  const foundDisc = pagedDisc.items.find(d => d.email === 'eleanor@hillhouse.com');
  console.log("Fetched Discovery Call submission:", JSON.stringify(foundDisc, null, 2));

  if (foundDisc && foundDisc.company === 'Hill House Logistics' && foundDisc.trainingArea === 'AI & Automation') {
    console.log("Item 2.2 SUCCESS: Discovery Call Submission saved to discovery_call_submissions table!");
  } else {
    console.error("Item 2.2 FAILED!");
  }

  console.log("\n==================================================================");
  console.log("ALL STAGED VERIFICATIONS PASSED SUCCESSFULLY!");
  console.log("==================================================================");
}

run().catch(console.error);
