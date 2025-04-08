
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('HeitzFit Puppeteer Bot is running');
});

app.get('/slots', async (req, res) => {
  try {
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

    // Select center
    await page.waitForSelector('input[placeholder*="Centre"]', { timeout: 10000 });
    await page.type('input[placeholder*="Centre"]', '5009');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Navigate to planning
    await page.goto('https://app.heitzfit.com/#/planning/browse', { waitUntil: 'networkidle2' });

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

    await browser.close();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
