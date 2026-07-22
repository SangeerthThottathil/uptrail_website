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

const { addContactSubmission, addHireTalentSubmission, addDiscoveryCallSubmission, addApplication } = require('../lib/store/store');

async function testSubmissions() {
  console.log("1. Testing addContactSubmission...");
  try {
    await addContactSubmission({
      source: 'contact',
      name: 'Test User',
      email: 'testuser@example.com',
      message: 'Test message',
      fields: { phone: '+447000000000' }
    });
    console.log("addContactSubmission succeeded!");
  } catch (e) {
    console.error("addContactSubmission failed:", e.message);
  }

  console.log("\n2. Testing addHireTalentSubmission...");
  try {
    await addHireTalentSubmission({
      name: 'Test Hire',
      company: 'Test Company',
      email: 'testhire@example.com',
      numberOfHires: '1-5',
      rolesHiringFor: 'Data Analyst',
      message: 'Need 2 analysts'
    });
    console.log("addHireTalentSubmission succeeded!");
  } catch (e) {
    console.error("addHireTalentSubmission failed:", e.message);
  }

  console.log("\n3. Testing addDiscoveryCallSubmission...");
  try {
    await addDiscoveryCallSubmission({
      name: 'Test Discovery',
      company: 'Test Corp',
      email: 'testdiscovery@example.com',
      teamSize: '10-50',
      trainingArea: 'Data',
      message: 'Corporate training query'
    });
    console.log("addDiscoveryCallSubmission succeeded!");
  } catch (e) {
    console.error("addDiscoveryCallSubmission failed:", e.message);
  }

  console.log("\n4. Testing addApplication...");
  try {
    const appResult = await addApplication({
      programmeSlug: 'ai-data-analyst-career-programme',
      programmeTitle: 'AI Data Analyst Career Programme',
      track: 'career',
      name: 'Test Applicant',
      email: 'testapplicant@example.com',
      phone: '+447000000001',
      message: 'Plan: Pay Monthly',
      status: 'new'
    });
    console.log("addApplication succeeded:", appResult);
  } catch (e) {
    console.error("addApplication failed:", e.message);
  }
}

testSubmissions().catch(console.error);
