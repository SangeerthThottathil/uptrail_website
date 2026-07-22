const routes = [
  '/programmes/data-analytics-career-accelerator',
  '/programmes/data-analytics-career-accelerator/apply',
  '/blog/how-to-become-a-data-analyst-in-2025',
  '/admin/programmes/career/data-analytics-career-accelerator',
  '/admin/programmes/career/new',
];

async function checkDynamicRoutes() {
  console.log("Checking dynamic routes on dev server...");
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        headers: { 'Accept': 'text/html' }
      });
      const text = await res.text();
      const isError = res.status >= 500 || text.includes("An error occurred in the Server Components render") || text.includes("Unhandled Runtime Error");
      if (isError) {
        console.error(`FAILED: ${route} -> Status: ${res.status}`);
        console.error("Snippet:", text.slice(0, 500));
      } else {
        console.log(`OK: ${route} (status ${res.status})`);
      }
    } catch (err) {
      console.error(`ERROR: ${route} -> ${err.message}`);
    }
  }
}

checkDynamicRoutes().catch(console.error);
