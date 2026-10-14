// Prints the HTML sources in print-src/ to the PDFs in downloads/.
// Run from the repo root with a static server on :8765 (python3 -m http.server 8765).
// Playwright must be importable; set PW_CHROMIUM to a Chromium binary if needed.
const { chromium } = require('playwright');
const DOCS = {
  'collection-service': 'Metal-Recycling-Company-Collection-Service.pdf',
  'capability-statement': 'Metal-Recycling-Company-Capability-Statement.pdf',
  'spring-steel-specification': 'Metal-Recycling-Company-Spring-Steel-Specification.pdf',
};
const only = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  const p = await b.newPage();
  for (const [src, out] of Object.entries(DOCS)) {
    if (only.length && !only.includes(src)) continue;
    await p.goto(`http://localhost:8765/print-src/${src}.html`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: `downloads/${out}`, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log('wrote downloads/' + out);
  }
  await b.close();
})();
