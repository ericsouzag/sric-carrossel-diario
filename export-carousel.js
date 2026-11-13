const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const VIEW_W = 420;
const VIEW_H = 525;
const SCALE = 1080 / 420;

async function exportOne({ htmlPath, outDir, total }) {
  fs.mkdirSync(outDir, { recursive: true });
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    browser = await chromium.launch({
      executablePath: 'C:\\Users\\Suporte\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe',
    });
  }
  const page = await browser.newPage({
    viewport: { width: VIEW_W, height: VIEW_H },
    deviceScaleFactor: SCALE,
  });
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);

  await page.evaluate(() => {
    document.querySelectorAll('.ig-header,.ig-dots,.ig-actions,.ig-caption').forEach(el => el.style.display = 'none');
    const frame = document.querySelector('.ig-frame');
    frame.style.cssText = 'width:420px;height:525px;max-width:none;border-radius:0;box-shadow:none;overflow:hidden;margin:0;';
    const viewport = document.querySelector('.carousel-viewport');
    viewport.style.cssText = 'width:420px;height:525px;overflow:hidden;cursor:default;';
    document.body.style.cssText = 'padding:0;margin:0;display:block;overflow:hidden;';
  });
  await page.waitForTimeout(300);

  for (let i = 0; i < total; i++) {
    await page.evaluate((idx) => {
      const track = document.querySelector('.carousel-track');
      track.style.transition = 'none';
      track.style.transform = 'translateX(' + (-idx * 420) + 'px)';
    }, i);
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, `slide_${i + 1}.png`),
      clip: { x: 0, y: 0, width: VIEW_W, height: VIEW_H },
    });
    console.log('exported', path.join(outDir, `slide_${i + 1}.png`));
  }
  await browser.close();
}

async function main() {
  const slug = process.argv[2];
  const total = parseInt(process.argv[3], 10);
  if (!slug || !total) throw new Error('usage: node export-carousel.js <slug> <totalSlides>');
  const base = __dirname;
  await exportOne({ htmlPath: path.join(base, `${slug}.html`), outDir: path.join(base, 'piloto-' + slug), total });
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
