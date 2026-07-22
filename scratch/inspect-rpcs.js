const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybGF0cGx0YWpodGZwZHRncW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU4OTQ2NiwiZXhwIjoyMDk5MTY1NDY2fQ.Z8j1q5QC39LTCC4t6x3rRSbXCknlvge7zH-OJtLP7ZM";
const baseUrl = "https://yrlatpltajhtfpdtgqnp.supabase.co/rest/v1/";

async function run() {
  const res = await fetch(baseUrl, {
    headers: {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`
    }
  });

  if (!res.ok) {
    console.error("Failed to fetch PostgREST schema:", await res.text());
    return;
  }

  const schema = await res.json();
  const paths = Object.keys(schema.paths || {});
  const rpcs = paths.filter(path => path.startsWith("/rpc/"));
  console.log("RPC Paths:", rpcs);
}

run().catch(console.error);
