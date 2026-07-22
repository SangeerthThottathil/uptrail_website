const fs = require('fs');
const path = require('path');

async function fetchIcons() {
  console.log("Fetching Google Material Symbols icons metadata...");
  const res = await fetch("https://fonts.google.com/metadata/icons");
  let text = await res.text();
  // Google's metadata endpoint starts with ")]}'\n"
  if (text.startsWith(")]}'")) {
    text = text.substring(text.indexOf("\n"));
  }
  const json = JSON.parse(text);
  const icons = json.icons.map(i => i.name);
  console.log(`Extracted ${icons.length} icon names.`);
  console.log("Sample icons:", icons.slice(0, 20));

  const outPath = path.resolve(process.cwd(), 'lib/material-symbols.json');
  fs.writeFileSync(outPath, JSON.stringify(icons));
  console.log(`Saved ${icons.length} icon names to ${outPath}`);
}

fetchIcons().catch(console.error);
