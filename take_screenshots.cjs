const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Report screenshot images');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await sleep(1000);

  // 1. Dashboard Default
  await page.screenshot({ path: path.join(dir, '1_Dashboard_Captain_Cabin.png') });
  console.log('Took screenshot 1');

  // 2. Timetable Weekly
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('The Sea Chart')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '2_The_Sea_Chart_Weekly.png') });
  console.log('Took screenshot 2');

  // 3. Timetable Daily
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.filter-btn'));
    btns.find(b => b.innerText.includes('Daily Logbook')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '3_The_Sea_Chart_Daily.png') });
  console.log('Took screenshot 3');

  // 4. Timetable Subject-wise
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.filter-btn'));
    btns.find(b => b.innerText.includes('Subject-wise')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '4_The_Sea_Chart_SubjectWise.png') });
  console.log('Took screenshot 4');

  // 5. Attendance Tracker
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('Ship\'s Log')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '5_Ships_Log_Morale.png') });
  console.log('Took screenshot 5');

  // 6. Academic Hub
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('Bounties & Quests')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '6_Bounties_And_Quests.png') });
  console.log('Took screenshot 6');

  // 7. Focus Mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('The Doldrums')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '7_The_Doldrums_Focus.png') });
  console.log('Took screenshot 7');

  // 8. Analytics
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('Captain\'s Log')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '8_Captains_Log_Analytics.png') });
  console.log('Took screenshot 8');

  // 9. Settings
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('Ship Settings')).click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '9_Ship_Settings.png') });
  console.log('Took screenshot 9');

  // 10. Dashboard Faculty Portal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.nav-item button'));
    btns.find(b => b.innerText.includes('Captain\'s Cabin')).click();
  });
  await sleep(1000);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.filter-btn'));
    const facultyBtn = btns.find(b => b.innerText.includes('Captain'));
    if (facultyBtn) facultyBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(dir, '10_Dashboard_Captain_Portal.png') });
  console.log('Took screenshot 10');

  await browser.close();
  console.log('All screenshots taken and saved to "Report screenshot images".');
})();
