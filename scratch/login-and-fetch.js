const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] ${err.message}`);
  });

  page.on('request', req => {
    // console.log(`[REQUEST] ${req.method()} ${req.url()}`);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`[RESPONSE ERROR] ${res.status()} ${res.url()}`);
    }
  });

  console.log("Navigating to login page...");
  await page.goto('http://127.0.0.1:3000/admin/login');

  console.log("Filling login form...");
  await page.fill('input[name="email"]', 'admin@uptrail.co');
  await page.fill('input[name="password"]', 'AdminPassword123!');
  
  console.log("Clicking submit...");
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);

  console.log("Current URL after login:", page.url());

  console.log("Navigating to career edit page...");
  let response = await page.goto('http://127.0.0.1:3000/admin/programmes/career/ai-data-analyst-career-programme');
  console.log("Career response status:", response.status());

  console.log("Navigating to bootcamp edit page...");
  response = await page.goto('http://127.0.0.1:3000/admin/programmes/bootcamps/digital-marketing-bootcamp');
  console.log("Bootcamp response status:", response.status());

  console.log("Navigating to certification edit page...");
  response = await page.goto('http://127.0.0.1:3000/admin/programmes/certifications/comptia-data-certification-programme');
  console.log("Certification response status:", response.status());

  await page.waitForTimeout(2000);

  const title = await page.title();
  console.log("Page title:", title);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("Body text contains '404' or 'not found'?", bodyText.toLowerCase().includes('not found') || bodyText.toLowerCase().includes('404'));
  console.log("Body text preview:", bodyText.slice(0, 500));

  await page.screenshot({ path: 'scratch/edit_page_screenshot.png' });
  console.log("Screenshot saved to scratch/edit_page_screenshot.png");

  await browser.close();
}

run().catch(console.error);
