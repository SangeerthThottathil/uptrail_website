const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Testing dashboard query range approaches...");

  // Let's get the list of unique programme titles
  const { data: programmesData, error: progErr } = await supabase
    .from('programme_applications')
    .select('programme_title');
    
  if (progErr) {
    console.error("Error fetching programmes:", progErr);
    return;
  }

  const uniqueProgrammes = [...new Set(programmesData.map(p => p.programme_title))].filter(Boolean);
  console.log("Unique programmes with applications:", uniqueProgrammes);

  // Set up date ranges
  const now = new Date();
  
  // Today boundaries
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Yesterday boundaries
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1);
  
  // Last 7 days (including today)
  const last7DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  
  // Last 14 days (including today)
  const last14DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
  
  // Month-to-date (from 1st of current month)
  const monthToDateStart = new Date(now.getFullYear(), now.getMonth(), 1);

  console.log("\nComputed Date Boundaries (Local Time):");
  console.log(`- Today: ${todayStart.toISOString()} to ${now.toISOString()}`);
  console.log(`- Yesterday: ${yesterdayStart.toISOString()} to ${yesterdayEnd.toISOString()}`);
  console.log(`- Last 7 Days: ${last7DaysStart.toISOString()} to ${now.toISOString()}`);
  console.log(`- Last 14 Days: ${last14DaysStart.toISOString()} to ${now.toISOString()}`);
  console.log(`- Last Month (Month-To-Date): ${monthToDateStart.toISOString()} to ${now.toISOString()}`);

  // Propose query execution
  console.log("\nExecuting test count queries for a sample programme...");
  if (uniqueProgrammes.length > 0) {
    const sampleProg = uniqueProgrammes[0];
    console.log(`Selected sample programme: "${sampleProg}"`);

    // Let's run count queries in parallel
    const [todayCount, yesterdayCount, last7Count, last14Count, monthCount] = await Promise.all([
      supabase.from('programme_applications').select('*', { count: 'exact', head: true })
        .eq('programme_title', sampleProg).gte('created_at', todayStart.toISOString()),
      supabase.from('programme_applications').select('*', { count: 'exact', head: true })
        .eq('programme_title', sampleProg).gte('created_at', yesterdayStart.toISOString()).lte('created_at', yesterdayEnd.toISOString()),
      supabase.from('programme_applications').select('*', { count: 'exact', head: true })
        .eq('programme_title', sampleProg).gte('created_at', last7DaysStart.toISOString()),
      supabase.from('programme_applications').select('*', { count: 'exact', head: true })
        .eq('programme_title', sampleProg).gte('created_at', last14DaysStart.toISOString()),
      supabase.from('programme_applications').select('*', { count: 'exact', head: true })
        .eq('programme_title', sampleProg).gte('created_at', monthToDateStart.toISOString()),
    ]);

    console.log(`Results for ${sampleProg}:`);
    console.log(`- Today: ${todayCount.count || 0}`);
    console.log(`- Yesterday: ${yesterdayCount.count || 0}`);
    console.log(`- Last 7 Days: ${last7Count.count || 0}`);
    console.log(`- Last 14 Days: ${last14Count.count || 0}`);
    console.log(`- Last Month: ${monthCount.count || 0}`);
  }
}

run().catch(console.error);
