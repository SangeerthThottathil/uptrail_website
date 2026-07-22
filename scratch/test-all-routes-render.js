const routes = [
  '/',
  '/admin',
  '/admin/applications/career',
  '/admin/blog',
  '/admin/contact-submissions',
  '/admin/employers',
  '/admin/login',
  '/admin/programmes/career',
  '/admin/settings',
  '/admin/stats',
  '/admin/submissions/discovery-calls',
  '/admin/submissions/hire-talent',
  '/admin/success-stories',
  '/admin/testimonials',
  '/admin/video-testimonials',
  '/application-received',
  '/blog',
  '/business',
  '/consultation',
  '/contact',
  '/employers',
  '/faq',
  '/privacy-policy',
  '/success-stories',
  '/terms-and-conditions',
  '/why-uptrail',
];

async function checkAllRoutes() {
  console.log("Checking all routes on dev server...");
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        headers: { 'Accept': 'text/html' }
      });
      const text = await res.text();
      const isError = res.status >= 500 || text.includes("An error occurred in the Server Components render") || text.includes("Unhandled Runtime Error");
      if (isError) {
        console.error(`FAILED: ${route} -> Status: ${res.status}`);
        // Extract error title/heading
        const match = text.match(/<h\d[^>]*>(.*?)<\/h\d>/gi) || text.match(/<title>(.*?)<\/title>/i);
        console.error("Snippet:", match ? match.slice(0, 3).join(' | ') : text.slice(0, 300));
      } else {
        console.log(`OK: ${route} (status ${res.status})`);
      }
    } catch (err) {
      console.error(`ERROR: ${route} -> ${err.message}`);
    }
  }
}

checkAllRoutes().catch(console.error);
