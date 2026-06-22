import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Assuming the dev server is running on http://localhost:5173
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // Wait for map or initial tab
  await page.waitForSelector('.app-container', { timeout: 10000 });

  // Execute click on Exam Peak from the PirateMap
  // But wait, the map is rendered via PirateMap.jsx
  // It might be easier to trigger 'examprep' tab programmatically or wait for it.
  // We can evaluate some script or click on Exam Peak if it's visible.
  
  // Let's just find the text "Exam Peak" in the page.
  // The map has nodes. The node for Exam Peak has label "Exam Peak".
  try {
    // Wait for the SVG text elements to appear in the map
    await page.waitForSelector('text', { timeout: 5000 });
    const examprepTab = await page.evaluateHandle(() => {
      const texts = Array.from(document.querySelectorAll('text'));
      return texts.find(t => t.textContent.includes('Exam Peak'))?.closest('g');
    });

    if (examprepTab) {
      await examprepTab.click();
      console.log('Clicked on Exam Peak');
    } else {
      console.log('Exam Peak not found on map');
    }
  } catch(e) {
    console.log('Error clicking map:', e.message);
  }

  // Wait for Mock Exam button
  await page.waitForSelector('button::-p-text(Start Mock Exam)', { timeout: 5000 });
  await page.click('button::-p-text(Start Mock Exam)');
  console.log('Started Mock Exam');

  // Wait for radios to appear
  await page.waitForSelector('input[type="radio"]');
  
  // Find correct answers
  // Q1: GET
  // Q2: useEffect
  // Q3: 22
  const options = await page.$$('label');
  for (const option of options) {
    const text = await page.evaluate(el => el.textContent, option);
    if (['GET', 'useEffect', '22'].includes(text.trim())) {
      await option.click();
    }
  }

  // Submit Exam
  await page.click('button::-p-text(Submit Exam)');
  console.log('Submitted Exam');

  // Wait for result
  await page.waitForSelector('span::-p-text(Last Score: 100%)', { timeout: 5000 });
  console.log('Verified 100% score');

  // Verify predictive chart text
  const texts = await page.$$eval('svg text', els => els.map(e => e.textContent));
  console.log('SVG Texts:', texts);

  await browser.close();
})();
