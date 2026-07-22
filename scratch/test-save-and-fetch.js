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

const { saveProgramme, getProgramme } = require('../lib/store/store');

async function test() {
  const slug = 'ai-data-analyst-career-programme';
  console.log("Fetching programme before update...");
  const programme = await getProgramme(slug);
  if (!programme) {
    console.error("Programme not found");
    return;
  }

  console.log("Existing payment options count:", programme.paymentOptions ? programme.paymentOptions.length : 0);

  // Set card 0 as highlighted
  const options = [
    {
      pillText: 'Pay upfront',
      title: 'Full Tuition',
      description: 'Pay full tuition upfront and save.',
      bulletPoints: ['Discount included', 'Full access'],
      buttonLabel: 'Enroll Now',
      icon: 'Wallet',
      isHighlighted: true
    },
    {
      pillText: 'Monthly plan',
      title: 'Installment Plan',
      description: 'Spread the cost over 6 months.',
      bulletPoints: ['Flexible payments', 'No interest'],
      buttonLabel: 'Apply Now',
      icon: 'CreditCard',
      isHighlighted: false
    }
  ];

  programme.paymentOptions = options;

  console.log("Saving programme with Card #1 highlighted...");
  await saveProgramme(programme, slug);

  console.log("Fetching programme after update...");
  const updated = await getProgramme(slug);
  console.log("Updated payment options:", JSON.stringify(updated.paymentOptions, null, 2));

  const countHighlighted = updated.paymentOptions.filter(o => o.isHighlighted).length;
  console.log("Highlighted count:", countHighlighted);
  if (countHighlighted === 1 && updated.paymentOptions[0].isHighlighted) {
    console.log("\n==============================================");
    console.log("SUCCESS! Card #1 is highlighted and clean pillText is restored!");
    console.log("==============================================");
  } else {
    console.error("TEST FAILED!");
  }
}

test().catch(console.error);
