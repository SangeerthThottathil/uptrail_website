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
  console.log("VERIFYING DOWNLOAD BROCHURE BUTTON CONTROLS");
  console.log("==================================================================");

  // 1. Verify Site Settings
  console.log("\n1. Verifying Site Settings save and load...");
  const settings = await store.getSettings();
  console.log("Current general settings fields:", Object.keys(settings.general));

  settings.general.downloadBrochureEnabled = true;
  settings.general.downloadBrochureUrl = "https://example.com/test-brochure.pdf";
  await store.saveSettings(settings);
  console.log("Saved test settings.");

  const updatedSettings = await store.getSettings();
  console.log("Updated downloadBrochureEnabled:", updatedSettings.general.downloadBrochureEnabled);
  console.log("Updated downloadBrochureUrl:", updatedSettings.general.downloadBrochureUrl);

  if (updatedSettings.general.downloadBrochureEnabled === true && updatedSettings.general.downloadBrochureUrl === "https://example.com/test-brochure.pdf") {
    console.log("SUCCESS: Global Download Brochure Settings are functional!");
  } else {
    console.error("FAILED!");
  }

  // 2. Verify Programme Brochure settings
  console.log("\n2. Verifying Programme Brochure settings save and load...");
  const prog = await store.getProgramme("ai-data-analyst-career-programme");
  if (prog) {
    prog.brochureEnabled = true;
    prog.brochureUrl = "https://example.com/prog-brochure.pdf";
    await store.saveProgramme(prog);
    console.log("Saved programme brochure settings.");

    const updatedProg = await store.getProgramme("ai-data-analyst-career-programme");
    console.log("Updated programme brochureEnabled:", updatedProg.brochureEnabled);
    console.log("Updated programme brochureUrl:", updatedProg.brochureUrl);

    if (updatedProg.brochureEnabled === true && updatedProg.brochureUrl === "https://example.com/prog-brochure.pdf") {
      console.log("SUCCESS: Programme-specific Download Brochure Settings are functional!");
    } else {
      console.error("FAILED!");
    }
  } else {
    console.log("Programme not found, skipping.");
  }
}

run().catch(console.error);
