const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const W = 540, H = 960, SCALE = 2; // -> 1080x1920 frames
const FPS = 30;

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error('usage: node export-reel.js <slug>');
  const base = __dirname;
  const meta = JSON.parse(fs.readFileSync(path.join(base, `reel-${slug}.meta.json`), 'utf8'));
  const framesDir = path.join(base, 'reel-frames-' + slug);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  let browser;
  try {
    browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox'] } : undefined);
  } catch (e) {
    browser = await chromium.launch({
      executablePath: 'C:\\Users\\Suporte\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe',
    });
  }
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    deviceScaleFactor: SCALE,
  });
  await page.goto('file:///' + path.join(base, `reel-${slug}.html`).replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400); // let fonts settle

  await page.evaluate(() => { document.getAnimations().forEach(a => a.pause()); });

  const totalFrames = Math.ceil((meta.totalMs / 1000) * FPS);
  for (let i = 0; i < totalFrames; i++) {
    const t = (i / FPS) * 1000;
    await page.evaluate((tt) => { document.getAnimations().forEach(a => { a.currentTime = tt; }); }, t);
    await page.screenshot({ path: path.join(framesDir, `f${String(i).padStart(5, '0')}.png`) });
  }
  await browser.close();
  console.log('captured', totalFrames, 'frames');

  const outDir = base;
  const mp4Path = path.join(outDir, `reel-${slug}.mp4`);

  await new Promise((resolve, reject) => {
    ffmpeg(path.join(framesDir, 'f%05d.png'))
      .inputOptions([`-framerate ${FPS}`])
      .outputOptions(['-c:v libx264', '-pix_fmt yuv420p', '-profile:v high', '-crf 18', '-movflags +faststart'])
      .save(mp4Path)
      .on('end', resolve)
      .on('error', reject);
  });

  console.log('wrote', mp4Path);
}

main().catch(e => { console.error(e); process.exit(1); });
