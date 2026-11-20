const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const W = 540, H = 960, SCALE = 2; // -> 1080x1920 frames
const FPS = 30;
// Regra de capa do feed: o Instagram gera a miniatura do Reel a partir dos
// primeiros frames do vídeo. Como todo Reel abre com o fundo azul do gradiente
// (sem nada ainda desenhado), toda publicação ficava com a MESMA miniatura no
// feed. Fix: depois de capturar a animação inteira, prefixamos alguns frames
// (poucos milissegundos, imperceptível ao assistir) repetindo a ÚLTIMA tela do
// vídeo (a de fechamento/CTA) -- que já é diferente em cada Reel -- então o
// Instagram pega essa imagem como miniatura em vez do fundo azul vazio.
const COVER_MS = 180;

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

  // prefixa cópias do último frame (tela de fechamento) pra servir de miniatura no feed
  const coverFrames = Math.max(1, Math.round((COVER_MS / 1000) * FPS));
  const frameName = (i) => path.join(framesDir, `f${String(i).padStart(5, '0')}.png`);
  const lastFrameBuffer = fs.readFileSync(frameName(totalFrames - 1));
  for (let i = totalFrames - 1; i >= 0; i--) {
    fs.renameSync(frameName(i), frameName(i + coverFrames));
  }
  for (let i = 0; i < coverFrames; i++) {
    fs.writeFileSync(frameName(i), lastFrameBuffer);
  }
  console.log('prefixed', coverFrames, 'cover frames (', COVER_MS, 'ms) using the closing screen');

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
