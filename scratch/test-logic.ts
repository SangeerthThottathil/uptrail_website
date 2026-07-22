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

import { getProgramme } from '../lib/store/store'
import { getTrackMeta } from '../lib/store/tracks'

async function test(track: string, slug: string) {
  console.log(`--- Testing track: "${track}", slug: "${slug}" ---`);
  
  const meta = getTrackMeta(track);
  console.log("meta found:", !!meta);
  if (meta) {
    console.log("meta.track:", meta.track);
    console.log("meta.segment:", meta.segment);
  }

  const programme = await getProgramme(slug);
  console.log("programme found:", !!programme);
  if (programme) {
    console.log("programme.title:", programme.title);
    console.log("programme.track:", programme.track);
    console.log("programme.slug:", programme.slug);
    console.log("track mismatch:", programme.track !== (meta ? meta.track : null));
  }
}

async function run() {
  await test('career', 'ai-data-analyst-career-programme');
  await test('bootcamps', 'digital-marketing-bootcamp');
  await test('certifications', 'comptia-data-certification-programme');
}

run().catch(console.error);
