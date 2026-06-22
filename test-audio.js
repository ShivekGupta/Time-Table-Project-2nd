import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const results = await page.evaluate(async () => {
    const logs = [];
    let errors = 0;
    
    // Simulate spamming the bell icon
    const bell = document.querySelector('.notifications-bell');
    if (!bell) {
      logs.push("Bell not found");
      return logs;
    }

    logs.push("Spamming bell 15 times...");
    for (let i = 0; i < 15; i++) {
      try {
        bell.click();
      } catch (e) {
        logs.push("Click error: " + e.message);
        errors++;
      }
    }
    
    logs.push("Total synchronous errors: " + errors);
    
    await new Promise(r => setTimeout(r, 1000));
    return logs;
  });

  results.forEach(msg => console.log(msg));

  await browser.close();
})();
