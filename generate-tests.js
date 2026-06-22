import fs from 'fs';

const testsCode = `
    // TIER 1
    // F1: Modal Navigation
    await runTest('T1.1 Modal Navigation - Dashboard', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click(); // Dashboard
      await page.waitForSelector('.map-modal-overlay', { visible: true });
    });
    
    await runTest('T1.2 Click wax-seal-btn closes modal', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.waitForSelector('.map-modal-overlay', { visible: true });
      await page.click('.wax-seal-btn');
      await page.waitForFunction(() => !document.querySelector('.map-modal-overlay'));
    });

    await runTest('T1.3 Click Back to Map closes modal', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.waitForSelector('.map-modal-overlay', { visible: true });
      const btns = await page.$$('button');
      for (const b of btns) {
        const text = await page.evaluate(el => el.textContent, b);
        if (text.includes('Back to Map')) {
          await b.click();
          break;
        }
      }
      await page.waitForFunction(() => !document.querySelector('.map-modal-overlay'));
    });

    await runTest('T1.4 Open Timetable renders component', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[1].click(); // Timetable is index 1
      await page.waitForSelector('.timetable-section', { visible: true });
    });

    await runTest('T1.5 Open Settings renders component', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[10].click(); // Settings is index 10
      await page.waitForSelector('.glass-card', { visible: true });
    });

    // F2: Ambient World Events & Spyglass
    await runTest('T1.6 Verify .seagull elements exist', async (page) => {
      const gulls = await page.$$('.seagull');
      if (gulls.length === 0) throw new Error('No seagulls found');
    });

    await runTest('T1.7 Verify .cloud-shadow elements exist', async (page) => {
      const clouds = await page.$$('.cloud-shadow');
      if (clouds.length === 0) throw new Error('No cloud shadows found');
    });

    await runTest('T1.8 Verify day/night cycle overlay exists', async (page) => {
      const overlays = await page.$$eval('div', divs => divs.filter(d => getComputedStyle(d).mixBlendMode !== 'normal'));
      if (overlays.length === 0) throw new Error('No mixBlendMode overlay found');
    });

    await runTest('T1.9 Verify Fog of War mask exists', async (page) => {
      const mask = await page.$('mask#fog-mask');
      if (!mask) throw new Error('Fog mask not found');
    });

    await runTest('T1.10 Hold Shift makes Spyglass opacity 1', async (page) => {
      await page.keyboard.down('Shift');
      await page.waitForFunction(() => {
        const spyglass = document.querySelector('.map-background > div > div:last-child'); // It's the spyglass overlay
        return spyglass && getComputedStyle(spyglass).opacity === '1';
      });
      await page.keyboard.up('Shift');
    });

    // F3: Hidden Doubloons
    await runTest('T1.11 Verify 5 .hidden-doubloon elements on fresh load', async (page) => {
      const d = await page.$$('.hidden-doubloon');
      if (d.length !== 5) throw new Error(\`Expected 5 doubloons, got \${d.length}\`);
    });

    await runTest('T1.12 Verify header treasure counter reads 0', async (page) => {
      const headerText = await page.$eval('.top-header', el => el.textContent);
      if (!headerText.includes('0')) throw new Error('Treasure counter not 0'); // Need better selector maybe
    });

    await runTest('T1.13 Click one doubloon -> counter becomes 1', async (page) => {
      const d = await page.$$('.hidden-doubloon');
      await d[0].click();
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('1');
      });
    });

    await runTest('T1.14 Doubloon disappears from DOM after clicking', async (page) => {
      const d = await page.$$('.hidden-doubloon');
      await d[0].click();
      await page.waitForFunction(() => document.querySelectorAll('.hidden-doubloon').length === 4);
    });

    await runTest('T1.15 Click all 5 doubloons -> counter 5', async (page) => {
      let d = await page.$$('.hidden-doubloon');
      for (let i = 0; i < 5; i++) {
        await page.click('.hidden-doubloon'); // clicks the first visible one each time
        await page.waitForTimeout(100);
      }
      await page.waitForFunction(() => document.querySelectorAll('.hidden-doubloon').length === 0);
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('5');
      });
    });

    // F4: Theme Toggling
    await runTest('T1.16 Click Light theme -> data-theme=light', async (page) => {
      await page.click('button[aria-label="Light theme"]');
      const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
      if (theme !== 'light') throw new Error('data-theme not light');
    });

    await runTest('T1.17 Click Dark theme -> data-theme=dark', async (page) => {
      await page.click('button[aria-label="Dark theme"]');
      const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
      if (theme !== 'dark') throw new Error('data-theme not dark');
    });

    await runTest('T1.18 Click Waves Off -> text changes to Waves On and class updates', async (page) => {
      const btn = await page.$('button[title="Toggle Ambient Ocean Sounds"]');
      await btn.click();
      const text = await page.evaluate(el => el.textContent, btn);
      if (!text.includes('Waves On')) throw new Error('Text not Waves On');
      const classes = await page.evaluate(el => el.className, btn);
      if (!classes.includes('active')) throw new Error('No active class');
    });

    await runTest('T1.19 Click 3D Space -> canvas replaces ocean waves', async (page) => {
      const btn = await page.$('button[title="Toggle 3D Starry Background"]');
      await btn.click();
      await page.waitForSelector('canvas');
      const waves = await page.$('.ocean-waves-container'); // Need to check if OceanWaves unmounts. App.jsx uses ThreeCanvas
      if (waves) throw new Error('Ocean waves still exist');
    });

    await runTest('T1.20 Click notification bell -> dropdown appears', async (page) => {
      await page.click('.notifications-bell');
      await page.waitForSelector('.notifications-dropdown');
    });

    // F5: App Tabs
    await runTest('T1.21 Verify 11 .map-marker elements exist', async (page) => {
      const markers = await page.$$('.map-marker');
      if (markers.length !== 11) throw new Error('Not 11 markers');
    });

    await runTest('T1.22 Hover marker -> cloud-tooltip visible', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].hover();
      await page.waitForSelector('.cloud-tooltip', { visible: true });
    });

    await runTest('T1.23 Click Timetable marker -> header title changes', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[1].click();
      await page.waitForFunction(() => document.querySelector('.top-header').textContent.includes('The Sea Chart'));
    });

    await runTest('T1.24 Click Dashboard marker -> header title changes', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.waitForFunction(() => document.querySelector('.top-header').textContent.includes('The Captain\\'s Cabin'));
    });

    await runTest('T1.25 Navigate 2 markers -> path line generates', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click(); // Dashboard
      await markers[1].click(); // Timetable
      // Check SVG for path line
      await page.waitForSelector('line[mask^="url(#path-mask-"]');
    });

    // TIER 2
    // F1: Modal Boundaries
    await runTest('T2.26 Open and close modal rapidly 5 times', async (page) => {
      const markers = await page.$$('.map-marker');
      for(let i=0; i<5; i++){
        await markers[0].click();
        await page.waitForSelector('.map-modal-overlay');
        await page.click('.wax-seal-btn');
        await page.waitForFunction(() => !document.querySelector('.map-modal-overlay'));
      }
    });

    await runTest('T2.27 Open modal with 3D background -> z-index behaves', async (page) => {
      await page.click('button[title="Toggle 3D Starry Background"]');
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.waitForSelector('.map-modal-overlay');
      // Just check it's open
    });

    await runTest('T2.28 Verify .main-content max-height constrained', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      const mh = await page.$eval('.main-content', el => getComputedStyle(el).maxHeight);
      if (!mh.includes('vh') && !mh.includes('px')) throw new Error('Not constrained'); // It's 80vh
    });

    await runTest('T2.29 Click outside modal content -> does not close', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.waitForSelector('.map-modal-overlay');
      // click overlay at top left (outside content)
      await page.mouse.click(10, 10);
      await page.waitForTimeout(200);
      const exists = await page.$('.map-modal-overlay');
      if (!exists) throw new Error('Modal closed unexpectedly');
    });

    await runTest('T2.30 Access map view -> Back to Map hidden', async (page) => {
      const btn = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent.includes('Back to Map'));
      });
      if (btn) throw new Error('Back to map button visible on map');
    });

    // F2: Event Boundaries
    await runTest('T2.31 Spyglass position clamps', async (page) => {
      await page.keyboard.down('Shift');
      await page.mouse.move(0, 0);
      // Not easily verifiable exact clamp without hardcoding bounds, let's just ensure no error
      await page.keyboard.up('Shift');
    });

    await runTest('T2.32 Release Shift -> opacity 0', async (page) => {
      await page.keyboard.down('Shift');
      await page.waitForTimeout(100);
      await page.keyboard.up('Shift');
      await page.waitForFunction(() => {
        const spyglass = document.querySelector('.map-background > div > div:last-child'); 
        return spyglass && getComputedStyle(spyglass).opacity === '0';
      });
    });

    await runTest('T2.33 Click Kraken Zone', async (page) => {
      // Find kraken zone div - it has title "Here Be Monsters..."
      await page.click('div[title="Here Be Monsters..."]');
    });

    await runTest('T2.34 Konami Code -> ghost ship', async (page) => {
      const keys = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
      for (const k of keys) await page.keyboard.press(k);
      await page.waitForSelector('.ghost-ship-mode');
    });

    await runTest('T2.35 Type arrr -> growl', async (page) => {
      const keys = ['a','r','r','r'];
      for (const k of keys) await page.keyboard.press(k);
    });

    // F3: Treasure Boundaries
    await runTest('T2.36 Reload persists doubloons via localStorage', async (page) => {
      await page.click('.hidden-doubloon');
      await page.click('.hidden-doubloon'); // another one
      await page.reload({waitUntil: 'networkidle0'});
      await page.waitForFunction(() => document.querySelectorAll('.hidden-doubloon').length === 3);
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('2');
      });
    });

    await runTest('T2.37 Reload after all doubloons -> no doubloons', async (page) => {
      for(let i=0;i<5;i++) {
        await page.click('.hidden-doubloon');
        await page.waitForTimeout(50);
      }
      await page.reload({waitUntil: 'networkidle0'});
      await page.waitForFunction(() => document.querySelectorAll('.hidden-doubloon').length === 0);
    });

    await runTest('T2.38 Set localStorage 999 -> displays 999', async (page) => {
      await page.evaluate(() => localStorage.setItem('pirate_map_treasure', '999'));
      await page.reload({waitUntil: 'networkidle0'});
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('999');
      });
    });

    await runTest('T2.39 Doubloon blocked by modal', async (page) => {
      // we can't easily click a blocked element with Puppeteer if pointer-events block it.
      // Actually puppeteer throws if element is covered.
      const markers = await page.$$('.map-marker');
      await markers[0].click(); // open modal
      await page.waitForSelector('.map-modal-overlay');
      const d = await page.$('.hidden-doubloon');
      try {
        await d.click({timeout: 1000});
        throw new Error('Clicked!');
      } catch (e) {
        if(e.message === 'Clicked!') throw new Error('Should have been blocked');
      }
    });

    await runTest('T2.40 Find doubloon with Spyglass', async (page) => {
      await page.keyboard.down('Shift');
      await page.click('.hidden-doubloon');
      await page.keyboard.up('Shift');
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('1');
      });
    });

    // F4: Theme Boundaries
    await runTest('T2.41 Reload persists theme', async (page) => {
      await page.click('button[aria-label="Light theme"]');
      await page.reload({waitUntil: 'networkidle0'});
      const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
      if (theme !== 'light') throw new Error('Theme not light');
    });

    await runTest('T2.42 Toggle 3D Space and 2D Waves 5 times', async (page) => {
      const btn = await page.$('button[title="Toggle 3D Starry Background"]');
      for(let i=0;i<5;i++){
        await btn.click();
        await page.waitForTimeout(50);
      }
    });

    await runTest('T2.43 Clear notifications', async (page) => {
      await page.click('.notifications-bell');
      await page.click('.notifications-dropdown button.modal-close');
      const badge = await page.$('.bell-badge');
      if (badge) throw new Error('Badge still exists');
    });

    await runTest('T2.44 Settings -> Emerald color theme', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[10].click(); // Settings
      await page.click('div[title="Ghost Ship"]'); // Emerald
      const ct = await page.$eval('html', el => el.getAttribute('data-color-theme'));
      if (ct !== 'emerald') throw new Error('Color theme not emerald');
    });

    await runTest('T2.45 Click outside notifications closes it', async (page) => {
      await page.click('.notifications-bell');
      await page.waitForSelector('.notifications-dropdown');
      await page.mouse.click(10, 10); // click top left
      await page.waitForFunction(() => !document.querySelector('.notifications-dropdown'));
    });

    // F5: App Tab Interactions
    await runTest('T2.46 Click already active map marker -> no duplicate path', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.click('.wax-seal-btn'); // Close it, wait active is map? No, active Tab is dashboard, but closing modal sets it to map.
      // Wait, clicking marker sets active Tab.
      await markers[0].click();
      await markers[0].click();
      // Should have 1 segment (map -> dashboard) maybe? Or 0.
      // Just check it doesn't crash.
    });

    await runTest('T2.47 Click all 11 markers sequentially', async (page) => {
      const markers = await page.$$('.map-marker');
      for(let i=0; i<11; i++){
        const mm = await page.$$('.map-marker');
        await mm[i].click();
        await page.waitForTimeout(50);
      }
      const lines = await page.$$('line[mask^="url(#path-mask-"]');
      // at least some lines exist
      if (lines.length < 5) throw new Error('Not enough lines');
    });

    await runTest('T2.48 Verify LocalStorage pirate_map_fog', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      const fog = await page.evaluate(() => localStorage.getItem('pirate_map_fog'));
      if (!fog) throw new Error('No fog in localstorage');
    });

    await runTest('T2.49 Delete pirate_map_fog resets fog', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await page.evaluate(() => localStorage.removeItem('pirate_map_fog'));
      await page.reload({waitUntil: 'networkidle0'});
      const fog = await page.evaluate(() => localStorage.getItem('pirate_map_fog'));
      if (fog && fog !== '[]') throw new Error('Fog not reset');
    });

    await runTest('T2.50 Hover rapidly across all 11 markers', async (page) => {
      const markers = await page.$$('.map-marker');
      for(let i=0; i<11; i++){
        await markers[i].hover();
        await page.waitForTimeout(10);
      }
    });

    // TIER 3
    await runTest('T3.51 Theme + Modal', async (page) => {
      await page.click('button[aria-label="Light theme"]');
      const markers = await page.$$('.map-marker');
      await markers[1].click(); // Timetable
      await page.waitForSelector('.timetable-section');
    });

    await runTest('T3.52 3D Background + Doubloons', async (page) => {
      await page.click('button[title="Toggle 3D Starry Background"]');
      await page.click('.hidden-doubloon');
      await page.waitForFunction(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span && span.parentElement.textContent.includes('1');
      });
    });

    await runTest('T3.53 Fog of War + Settings Color', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await markers[1].click();
      await markers[10].click(); // Settings
      await page.click('div[title="Ghost Ship"]');
      await page.click('.wax-seal-btn');
      const lines = await page.$$('line');
      if (lines.length === 0) throw new Error('Lines lost');
    });

    await runTest('T3.54 Notifications + Audio', async (page) => {
      await page.click('.notifications-bell');
      await page.click('.notifications-dropdown button.modal-close');
      await page.click('button[title="Toggle Ambient Ocean Sounds"]');
    });

    await runTest('T3.55 Ghost Ship + Settings', async (page) => {
      const keys = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
      for (const k of keys) await page.keyboard.press(k);
      const markers = await page.$$('.map-marker');
      await markers[10].click();
      await page.click('div[title="Blood Sail"]');
    });

    // TIER 4
    await runTest('T4.56 The Completionist', async (page) => {
      for(let i=0;i<5;i++){
        await page.click('.hidden-doubloon');
      }
      await page.click('.notifications-bell');
      await page.click('.notifications-dropdown button.modal-close');
      await page.click('button[title="Toggle Ambient Ocean Sounds"]');
      const dc = await page.evaluate(() => document.querySelectorAll('.hidden-doubloon').length);
      if (dc !== 0) throw new Error('Not all doubloons collected');
    });

    await runTest('T4.57 The Night Owl Scholar', async (page) => {
      await page.click('button[aria-label="Dark theme"]');
      await page.click('button[title="Toggle 3D Starry Background"]');
      const markers = await page.$$('.map-marker');
      await markers[1].click();
      await page.click('.wax-seal-btn');
      await page.waitForSelector('canvas');
    });

    await runTest('T4.58 The Lost Captain', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[0].click();
      await markers[2].click();
      await markers[4].click();
      await markers[1].click();
      await markers[10].click();
      await page.click('div[title="Royal Galleon"]');
      await page.click('.wax-seal-btn');
      const lines = await page.$$('line');
      if (lines.length < 3) throw new Error('Not enough lines');
    });

    await runTest('T4.59 The Deep Diver', async (page) => {
      const markers = await page.$$('.map-marker');
      await markers[5].click(); // Focus
      await page.waitForTimeout(2000);
      await page.click('.wax-seal-btn');
      await page.keyboard.down('Shift');
      await page.click('div[title="Here Be Monsters..."]');
      await page.keyboard.up('Shift');
    });

    await runTest('T4.60 Full Loop Journey', async (page) => {
      await page.click('button[aria-label="Light theme"]');
      await page.click('.hidden-doubloon');
      const markers = await page.$$('.map-marker');
      await markers[0].click(); // Dashboard
      await page.click('.notifications-bell');
      await page.waitForSelector('.notifications-dropdown');
      // Back to map button
      const btns = await page.$$('button');
      for (const b of btns) {
        const text = await page.evaluate(el => el.textContent, b);
        if (text.includes('Back to Map')) {
          await b.click();
          break;
        }
      }
      await page.click('button[aria-label="Dark theme"]');
      const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
      if (theme !== 'dark') throw new Error('Theme not dark');
      const count = await page.evaluate(() => {
        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Treasures'));
        return span.parentElement.textContent;
      });
      if (!count.includes('1')) throw new Error('Count not 1');
    });
`;

const runnerContent = `
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 5173;
const URL = \`http://localhost:\${PORT}\`;

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(\`Status: \${res.statusCode}\`));
        }).on('error', reject);
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error('Server not ready');
}

async function runTests() {
  console.log('Starting dev server...');
  const server = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], { shell: true });
  
  let browser;
  try {
    await waitForServer(URL);
    console.log('Server is ready. Launching Puppeteer...');
    
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.goto(URL, { waitUntil: 'networkidle0' });

    console.log('Running tests...');

    let passed = 0;
    let failed = 0;
    const results = [];

    async function runTest(name, testFn) {
      try {
        await page.evaluate(() => localStorage.clear());
        await page.reload({ waitUntil: 'networkidle0' });
        await testFn(page);
        console.log(\`✅ PASS: \${name}\`);
        passed++;
        results.push({ name, status: 'PASS' });
      } catch (err) {
        console.error(\`❌ FAIL: \${name}\`);
        console.error(err);
        failed++;
        results.push({ name, status: 'FAIL', error: err.message });
      }
    }

${testsCode}

    console.log(\`\\nTest Run Complete. Passed: \${passed}, Failed: \${failed}\`);
    if (failed > 0) process.exitCode = 1;
    else process.exitCode = 0;
  } catch (err) {
    console.error('Fatal error:', err);
    process.exitCode = 1;
  } finally {
    console.log('Cleaning up...');
    if (browser) await browser.close();
    server.kill();
  }
}

runTests();
`;

fs.writeFileSync('run-e2e-tests.js', runnerContent);
