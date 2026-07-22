async function checkAdminRoute() {
  console.log("Fetching http://localhost:3000/admin ...");
  try {
    const res = await fetch("http://localhost:3000/admin", {
      redirect: 'manual'
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body preview (first 500 chars):", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

checkAdminRoute();
