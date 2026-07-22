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

const { saveTestimonials } = require('../app/admin/actions/content');

async function test() {
  const items = [
    {
      quote: '',
      name: '',
      role: '',
      programme: '',
      rating: 5,
      isFeatured: false,
      featuredTitle: '',
      image: '',
      iframeUrl: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>'
    },
    {
      quote: 'I went from a retail job to a data analyst role at a bank in five months.',
      name: 'Amara Okafor',
      role: 'Data Analyst, Tesco Bank',
      programme: 'Data Analytics',
      rating: 5,
      isFeatured: false,
      featuredTitle: '',
      image: '',
      iframeUrl: ''
    }
  ];

  console.log("Calling saveTestimonials server action...");
  await saveTestimonials(items);
  console.log("saveTestimonials completed!");
}

test().catch(console.error);
