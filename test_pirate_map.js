import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function runTest() {
  console.log("Starting vite server...");
  const viteProcess = spawn('npm.cmd', ['run', 'dev'], { cwd: process.cwd() });

  let serverReady = false;
  viteProcess.stdout.on('data', (data) => {
    if (data.toString().includes('Local:')) {
      serverReady = true;
    }
  });

  // wait for server
  for (let i=0; i<15; i++) {
    if (serverReady) break;
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!serverReady) {
    console.log("Vite server failed to start in time.");
  } else {
    console.log("Server ready. Launching puppeteer...");
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Intercept Web Audio API
  await page.evaluateOnNewDocument(() => {
    window.audioPlayed = [];
    const originalCreateOscillator = window.AudioContext.prototype.createOscillator;
    window.AudioContext.prototype.createOscillator = function() {
      window.audioPlayed.push('oscillator_created');
      return originalCreateOscillator.apply(this, arguments);
    };
  });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  console.log("Testing Bug: Audio leak on hover");
  // The 'isAudioPlaying' state starts as false.
  // Hover over a map marker.
  const marker = await page.$('.map-marker');
  await marker.hover();
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 500));
  
  const audioLog1 = await page.evaluate(() => window.audioPlayed);
  console.log("Audio played on hover (isAudioPlaying=false):", audioLog1.length > 0 ? "YES" : "NO");
  const bugExists = audioLog1.length > 0;

  // Clear log
  await page.evaluate(() => { window.audioPlayed = []; });

  console.log("Testing Edge Case: No islands visited");
  const fogMaskShapes = await page.evaluate(() => {
    const mask = document.getElementById('fog-mask');
    return mask ? mask.children.length : 0;
  });
  console.log("Fog mask shapes (should be 1 for rect):", fogMaskShapes);

  const linesCount = await page.evaluate(() => {
    return document.querySelectorAll('line[stroke-dasharray="6 6"]').length;
  });
  console.log("Animated Ship Paths count (should be 0):", linesCount);

  console.log("Testing Edge Case: All islands visited");
  const markers = await page.$$('.map-marker');
  for (let m of markers) {
    await m.click();
    await new Promise(r => setTimeout(r, 100));
    const closeBtn = await page.$('.map-modal-close-btn');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 100));
    }
  }

  const fogMaskShapesAll = await page.evaluate(() => {
    const mask = document.getElementById('fog-mask');
    return mask ? mask.children.length : 0;
  });
  console.log("Fog mask shapes after visiting all (should be 12):", fogMaskShapesAll);

  const linesCountAll = await page.evaluate(() => {
    return document.querySelectorAll('line[stroke-dasharray="6 6"]').length;
  });
  console.log("Animated Ship Paths count after visiting all (should be 10):", linesCountAll);

  await browser.close();
  viteProcess.kill();
  
  const passVerdict = !bugExists && fogMaskShapes === 1 && linesCount === 0 && fogMaskShapesAll === 12 && linesCountAll === 10;
  console.log("Final Verdict:", passVerdict ? "PASS" : "FAIL");
}

runTest().catch(console.error);
