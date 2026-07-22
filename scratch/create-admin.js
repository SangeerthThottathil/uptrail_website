const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yrlatpltajhtfpdtgqnp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybGF0cGx0YWpodGZwZHRncW5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU4OTQ2NiwiZXhwIjoyMDk5MTY1NDY2fQ.Z8j1q5QC39LTCC4t6x3rRSbXCknlvge7zH-OJtLP7ZM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const email = 'admin@uptrail.co';
  const password = 'AdminPassword123!';

  // First check if the user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    console.log(`User ${email} already exists. Updating password...`);
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password: password
    });
    if (updateError) {
      console.error("Error updating user:", updateError);
    } else {
      console.log("Password updated successfully!");
    }
  } else {
    console.log(`Creating user ${email}...`);
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createError) {
      console.error("Error creating user:", createError);
    } else {
      console.log("User created successfully!");
    }
  }
}

run().catch(console.error);
