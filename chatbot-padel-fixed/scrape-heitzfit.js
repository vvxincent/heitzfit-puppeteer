
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://app.heitzfit.com', { waitUntil: 'networkidle0' });

  // Login
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'vincent@hirigoyen.com');
  await page.type('input[type="password"]', 'rm2021');
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Choix du centre
  await page.waitForSelector('input[placeholder*="Centre"]', { timeout: 10000 });
  await page.type('input[placeholder*="Centre"]', '5009');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // Aller à la page planning
  await page.goto('https://app.heitzfit.com/#/planning/browse', { waitUntil: 'networkidle2' });

  // Scraping
  await page.waitForSelector('.pl-evt-capacity', { timeout: 10000 });

  const slots = await page.evaluate(() => {
    const results = [];
    const capacityElements = document.querySelectorAll('.pl-evt-capacity');

    capacityElements.forEach(el => {
      if (el.innerText.trim() === '0/4') {
        const parent = el.closest('.pl-evt-row');
        if (!parent) return;

        const time = parent.querySelector('.pl-evt-hour')?.innerText.trim() || '';
        const name = parent.querySelector('.pl-evt-label')?.innerText.trim() || '';
        const location = parent.querySelector('.pl-evt-location')?.innerText.trim() || '';

        results.push({ time, name, location });
      }
    });

    return results;
  });

  console.log(JSON.stringify(slots, null, 2));
  await browser.close();
})();
