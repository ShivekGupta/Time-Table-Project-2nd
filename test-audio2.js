import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const results = await page.evaluate(async () => {
    const logs = [];
    let errors = 0;
    
    // We can call playPaperRustle via the module, but since it's an ES module, we don't have it globally.
    // However, the button triggers it.
    const bell = document.querySelector('.notifications-bell');
    
    logs.push("Spamming bell 30 times sync...");
    for (let i = 0; i < 30; i++) {
        // dispatching click event synchronously
        bell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    
    logs.push("Done loop");
    await new Promise(r => setTimeout(r, 500));
    return logs;
  });

  results.forEach(msg => console.log(msg));

  await browser.close();
})();
