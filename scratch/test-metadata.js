async function checkMetadata(path) {
  const url = `http://localhost:3000${path}`;
  const res = await fetch(url);
  const text = await res.text();
  
  const titleMatch = text.match(/<title>([^<]+)<\/title>/);
  const descMatch = text.match(/<meta\s+name="description"\s+content="([^"]+)"/);

  console.log(`\nURL: ${path}`);
  console.log(`Title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
  console.log(`Description: ${descMatch ? descMatch[1] : 'NOT FOUND'}`);
}

async function run() {
  const routes = [
    '/',
    '/programmes',
    '/bootcamps',
    '/certifications',
    '/consultation',
    '/business',
    '/hire',
    '/success-stories',
    '/blog',
    '/community',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/programmes/ai-data-analyst-career-programme',
    '/bootcamps/digital-marketing-bootcamp',
    '/bootcamps/business-analysis-bootcamp',
    '/bootcamps/ai-data-analyst-bootcamp',
    '/certifications/comptia-data-plus',
    '/blog/breaking-into-data-without-a-degree',
    '/blog/portfolio-projects-that-get-interviews',
    '/blog/switching-careers-in-your-thirties'
  ];

  for (const r of routes) {
    await checkMetadata(r);
  }
}

run().catch(console.error);
