const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = "https://yrlatpltajhtfpdtgqnp.supabase.co/rest/v1/";

async function run() {
  console.log("Fetching PostgREST OpenAPI schema...");
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
  
  console.log("\nTables found in schema:");
  const tables = Object.keys(schema.definitions || {});
  tables.forEach(table => {
    console.log(`- ${table}`);
  });

  console.log("\nRPC Paths found:");
  const paths = Object.keys(schema.paths || {});
  const rpcs = paths.filter(path => path.startsWith("/rpc/"));
  rpcs.forEach(rpc => {
    console.log(`- ${rpc}`);
  });
}

run().catch(console.error);
