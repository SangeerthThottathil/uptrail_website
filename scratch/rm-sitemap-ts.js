const fs = require('fs');
const path = require('path');

const target = path.resolve(process.cwd(), 'app/sitemap.ts');
if (fs.existsSync(target)) {
  fs.unlinkSync(target);
  console.log("Deleted app/sitemap.ts");
}
