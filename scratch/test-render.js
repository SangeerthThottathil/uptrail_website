// Load env variables
require('dotenv').config({ path: '.env.local' });

// Mock next/navigation
jest = { mock: () => {} };
require('next/navigation');
const mockNotFound = () => {
  console.log("MOCK notFound() called!");
  throw new Error("notFound");
};
require('next/navigation').notFound = mockNotFound;

const EditProgrammePage = require('../app/admin/(panel)/programmes/[track]/[slug]/page.tsx').default;

async function run() {
  const params = Promise.resolve({
    track: 'career',
    slug: 'ai-data-analyst-career-programme'
  });

  try {
    console.log("Calling EditProgrammePage...");
    await EditProgrammePage({ params });
    console.log("Rendered successfully without notFound!");
  } catch (e) {
    console.log("Caught:", e.message);
  }
}

run().catch(console.error);
