const store = require('../lib/store/store');

async function listProgs() {
  const progs = await store.getProgrammes();
  console.log("Programmes slugs:", progs.map(p => p.slug));
}

listProgs().catch(console.error);
