async function testSitemap() {
  console.log("Testing fetch on http://localhost:3000/sitemap.xml...");
  const res = await fetch("http://localhost:3000/sitemap.xml");
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Snippet:", text.slice(0, 300));
}

testSitemap().catch(console.error);
