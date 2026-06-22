import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Expose an error handler
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  console.log("Page loaded.");

  const results = await page.evaluate(async () => {
    const logs = [];
    const log = (msg) => logs.push(msg);

    const markers = document.querySelectorAll('.map-marker');
    log('Found map markers: ' + markers.length);

    if (markers.length < 2) return logs;

    // Hover first marker
    log('Dispatching mouseenter to first marker...');
    markers[0].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
    
    // Give it a moment (simulated)
    await new Promise(r => setTimeout(r, 100));

    // Click first marker
    log('Clicking first marker...');
    markers[0].click();
    await new Promise(r => setTimeout(r, 200));

    // Check circles
    const circles1 = document.querySelectorAll('mask#fog-mask circle');
    log('Circles after click 1: ' + circles1.length);

    // If modal opened, the activeTab might have changed. Let's see if we can still click the second marker.
    // The markers should still be in DOM.
    log('Clicking second marker...');
    markers[1].click();
    await new Promise(r => setTimeout(r, 200));

    const circles2 = document.querySelectorAll('mask#fog-mask circle');
    log('Circles after click 2: ' + circles2.length);

    // Check path masks
    const pathMasks = Array.from(document.querySelectorAll('mask[id^="path-mask"]')).map(m => {
      const line = m.querySelector('line');
      return {
        id: m.id,
        lineClass: line ? line.className.baseVal : null,
        strokeDashoffset: line ? line.getAttribute('stroke-dashoffset') : null
      };
    });
    log('Path masks: ' + JSON.stringify(pathMasks));

    // Check lines
    const pathLines = Array.from(document.querySelectorAll('svg > line')).map(l => {
      return {
        mask: l.getAttribute('mask'),
        strokeDasharray: l.getAttribute('stroke-dasharray')
      };
    });
    log('Animated path lines: ' + JSON.stringify(pathLines));

    return logs;
  });

  results.forEach(msg => console.log(msg));

  await browser.close();
})();
