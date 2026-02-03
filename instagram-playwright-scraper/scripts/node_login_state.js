const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening Instagram...');
  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle'
  });

  console.log('👉 Please login manually.');
  console.log('👉 After login, DO NOT close the browser.');
  console.log('👉 Wait until homepage is fully loaded.');

  // Wait long enough for manual login
  await page.waitForTimeout(60000);

  // Save login state
  await context.storageState({
    path: 'instagram_login_state.json'
  });

  console.log('✅ Login state saved as instagram_login_state.json');
  console.log('You can now close the browser.');

})();
