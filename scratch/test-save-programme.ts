import { getProgramme, upsertProgramme } from '../lib/store/store'
import fs from 'fs'
import path from 'path'

// Mock next/cache unstable_cache
require('next/cache').unstable_cache = (fn: any) => fn;

// Load env variables manually
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf('=')
    if (index > 0) {
      const key = trimmed.substring(0, index).trim()
      const val = trimmed.substring(index + 1).trim()
      process.env[key] = val
    }
  })
}

async function run() {
  console.log("Fetching programme...");
  const programme = await getProgramme('ai-data-analyst-career-programme');
  if (!programme) {
    console.error("Programme not found!");
    return;
  }

  console.log("Original programme fetched:", programme.title);
  
  // Make a small change
  programme.title = programme.title + " (Edited)";
  
  console.log("Saving programme...");
  try {
    await upsertProgramme(programme, 'ai-data-analyst-career-programme');
    console.log("Programme saved successfully!");
  } catch (err) {
    console.error("Error saving programme:", err);
  }
}

run().catch(console.error);
