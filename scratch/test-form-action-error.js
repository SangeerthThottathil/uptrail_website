const { chromium } = require('playwright');

async function debugFormSubmit() {
  console.log("Starting Playwright debug script for ai-data-analyst-career-programme...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('response', async res => {
    if (res.request().method() === 'POST') {
      console.log('POST RESPONSE STATUS:', res.status());
      try {
        const text = await res.text();
        console.log('POST RESPONSE TEXT:', text.slice(0, 1000));
      } catch (e) {}
    }
  });

  try {
    const url = 'http://localhost:3000/programmes/ai-data-analyst-career-programme/apply?plan=Upfront%20Payment';
    console.log("Navigating to:", url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#name', { timeout: 10000 });

    console.log("Filling #name...");
    await page.fill('#name', 'Test User');
    console.log("Filling #email...");
    await page.fill('#email', 'testuser@example.com');
    console.log("Filling #phone...");
    await page.fill('#phone', '7123456789');
    console.log("Checking #agreeToTerms...");
    await page.click('#agreeToTerms', { force: true });

    console.log("Clicking submit...");
    await page.click('button[type="submit"]', { force: true });

    console.log("Waiting for submission result...");
    await page.waitForTimeout(5000);

    console.log("Final URL:", page.url());
    const errorBox = await page.$('.bg-red-500\\/10');
    if (errorBox) {
      console.log("ERROR BOX ON PAGE:", await errorBox.textContent());
    } else {
      console.log("SUCCESS! No error box.");
    }
  } catch (err) {
    console.error("Playwright script error:", err);
  } finally {
    await browser.close();
  }
}

debugFormSubmit();
