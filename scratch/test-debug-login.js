async function debugLogin() {
  const res = await fetch("http://localhost:3000/admin/login");
  console.log("Status:", res.status);
  const html = await res.text();
  console.log("Full HTML Output length:", html.length);
  if (html.includes("404") || html.includes("Error") || html.includes("not found")) {
    // Print title and main content from html
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    console.log("Page Title:", titleMatch ? titleMatch[1] : "No title");
    
    // Find body text
    const bodyText = html.replace(/<style[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
    console.log("Cleaned Text Content:", bodyText.slice(0, 1000));
  }
}

debugLogin().catch(console.error);
