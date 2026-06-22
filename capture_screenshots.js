import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, 'Report screenshot images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  // Wait for the server to be ready
  let retries = 5;
  while (retries > 0) {
    try {
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
      break;
    } catch (err) {
      retries--;
      if (retries === 0) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Helper function to click a tab and take a screenshot
  async function takeScreenshot(tabName, filename) {
    // Click the tab based on text
    const tabs = await page.$$('.nav-item button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text.includes(tabName)) {
        await tab.click();
        await new Promise(r => setTimeout(r, 1000)); // wait for animation
        await page.screenshot({ path: path.join(outputDir, filename) });
        console.log(`Saved screenshot: ${filename}`);
        return;
      }
    }
    console.log(`Tab ${tabName} not found`);
  }

  await new Promise(r => setTimeout(r, 1000));
  
  // 1. Dashboard
  await takeScreenshot('Dashboard', '1_Dashboard.png');

  // 2. Timetable Viewer
  await takeScreenshot('Timetable Viewer', '2_Timetable_Viewer.png');

  // 3. Attendance
  await takeScreenshot('Attendance', '3_Attendance.png');

  // 4. Directory
  await takeScreenshot('Directory', '4_Directory.png');

  // 5. Academic Hub
  await takeScreenshot('Academic Hub', '5_Academic_Hub.png');

  // 6. Analytics
  await takeScreenshot('Analytics', '6_Analytics.png');

  // 7. AI Assistant
  await takeScreenshot('AI Assistant', '7_AI_Assistant.png');

  // 8. Export & Share
  await takeScreenshot('Export & Share', '8_Export_Share.png');

  // 9. Settings
  await takeScreenshot('Settings', '9_Settings.png');

  // 10. Notifications or Dark Theme
  // Go back to Dashboard
  await takeScreenshot('Dashboard', '10_Dashboard_Notifications.png');
  
  // Open notifications
  const bell = await page.$('.notifications-bell');
  if (bell) {
    await bell.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outputDir, '10_Dashboard_Notifications.png') });
    console.log(`Saved screenshot: 10_Dashboard_Notifications.png`);
  }

  await browser.close();
  console.log('Finished capturing 10 screenshots!');
})();
