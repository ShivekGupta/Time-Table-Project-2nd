import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 5173;
const URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status: ${res.statusCode}`));
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
        console.log(`✅ PASS: ${name}`);
        passed++;
        results.push({ name, status: 'PASS' });
      } catch (err) {
        console.error(`❌ FAIL: ${name}`);
        console.error(err);
        failed++;
        results.push({ name, status: 'FAIL', error: err.message });
      }
    }

    // TIER 1
    await runTest('T1.1 Modal Navigation - Dashboard', async (page) => {
      await page.waitForSelector('.map-marker', { timeout: 5000 });
      const markers = await page.$$('.map-marker');
      await markers[0].click(); // Dashboard
      await page.waitForSelector('.map-modal-overlay', { visible: true });
    });

    console.log(`\nTest Run Complete. Passed: ${passed}, Failed: ${failed}`);
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
