const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
