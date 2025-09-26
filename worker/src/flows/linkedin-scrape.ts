import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

export async function runLinkedInFlow(input: { searchQuery: string; maxProfiles: number }) {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...'
  });
  const page: Page = await context.newPage();

  try {
    // Go to LinkedIn (no login — public search only)
    await page.goto('https://www.linkedin.com', { waitUntil: 'networkidle' });

    // Search
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(input.searchQuery)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle' });

    // Wait + scroll
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Scrape up to N profiles
    const profiles = await page.$$eval('li div.entity-result__content a', (els, max) => {
      return els.slice(0, max).map(el => {
        return {
          name: el.textContent?.trim() || '',
          url: el.href
        };
      });
    }, input.maxProfiles || 20);

    // Save CSV
    const csv = 'Name,Profile URL\n' + profiles.map(p => `"${p.name}","${p.url}"`).join('\n');
    const filename = `result-${Date.now()}.csv`;
    const outPath = path.join('/tmp', filename);
    fs.writeFileSync(outPath, csv);

    // TODO: upload to S3 → return signed URL
    const fakeS3Url = `https://leadscrape-results.s3.amazonaws.com/${filename}`;
    return { url: fakeS3Url, count: profiles.length };
  } finally {
    await browser.close();
  }
}
