const { chromium } = require('playwright');

async function testSubmitForm() {
  console.log("Launching browser to test form submission on http://localhost:3000/programmes/data-analytics-career-accelerator/apply...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));
  page.on('requestfailed', req => console.error('REQUEST FAILED:', req.url(), req.failure()));

  try {
    await page.goto('http://localhost:3000/programmes/data-analytics-career-accelerator/apply?plan=Upfront%20Payment', { waitUntil: 'networkidle' });
    console.log("Page loaded. Filling form...");

    await page.fill('input#name', 'John Doe');
    await page.fill('input#email', 'johndoe@example.com');
    await page.fill('input#phone', '7123456789');
    await page.check('input#agreeToTerms');

    console.log("Submitting form...");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForTimeout(5000)
    ]);

    const url = page.url();
    console.log("Current URL after submit:", url);

    const errorDiv = await page.$('.bg-red-500\\/10');
    if (errorDiv) {
      const errorText = await errorDiv.textContent();
      console.log("Error text on page:", errorText);
    } else {
      console.log("No error div found on page!");
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

testSubmitForm();
