// Gera uma página única simulando como cada dia de um tema fica no Instagram
// (vídeo/carrossel dentro de uma moldura de post), pra revisão antes de publicar.
// Uso: node gen-preview-tema.js <slug-do-tema>
// Precisa de um arquivo tema-<slug>.json descrevendo os dias (ver geometria abaixo).

const fs = require('fs');
const path = require('path');
const { buildEmbeddableCarousel } = require('./gen-carousel.js');

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function statusBadge(status) {
  const map = {
    published: { label: 'PUBLICADO', bg: 'rgba(61,214,140,0.15)', fg: '#3DD68C', bd: 'rgba(61,214,140,0.3)' },
    ready: { label: 'PRONTO — AGUARDANDO APROVAÇÃO', bg: 'rgba(255,206,61,0.15)', fg: '#FFCE3D', bd: 'rgba(255,206,61,0.3)' },
  };
  const s = map[status] || map.ready;
  return `<span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:0.06em;padding:4px 10px;border-radius:20px;background:${s.bg};color:${s.fg};border:1px solid ${s.bd};">${s.label}</span>`;
}

function videoCard({ dayLabel, status, videoPath, caption }) {
  return `
  <div style="margin-bottom:46px;">
    <div style="display:flex;align-items:center;justify-content:space-between;max-width:420px;margin:0 auto 10px;padding:0 2px;">
      <span style="color:#8a8a8a;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${esc(dayLabel)}</span>
      ${statusBadge(status)}
    </div>
    <div style="width:420px;background:#000;color:#F5F5F5;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.35);margin:0 auto;">
      <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;"><b>professor.eric</b></div>
      <video src="${videoPath}" controls playsinline style="width:100%;display:block;background:#000;max-height:74vh;"></video>
      <div style="padding:10px 14px 18px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;"><b>professor.eric</b> ${esc(caption)}</div>
    </div>
  </div>`;
}

function carouselCard({ dayLabel, status, id, slides, caption }) {
  return `
  <div style="margin-bottom:46px;">
    <div style="display:flex;align-items:center;justify-content:space-between;max-width:420px;margin:0 auto 10px;padding:0 2px;">
      <span style="color:#8a8a8a;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${esc(dayLabel)}</span>
      ${statusBadge(status)}
    </div>
    ${buildEmbeddableCarousel({ id, slides, caption: esc(caption) })}
  </div>`;
}

function buildThemePreview({ title, days }) {
  const cards = days.map(d => {
    if (d.type === 'video') return videoCard(d);
    return carouselCard(d);
  }).join('\n');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Archivo:wght@700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{margin:0;min-height:100vh;background:#14171B;color:#F1EFE6;display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 0 80px;font-family:'Public Sans',system-ui,sans-serif;}
  h1{font-family:'Archivo',serif;font-weight:900;font-size:24px;margin:0 0 30px;}
  h1 span{color:#FACC15;}
</style>
</head>
<body>
<h1>${esc(title)}</h1>
${cards}
</body>
</html>`;
}

const THEMES = {
  geometria: {
    title: 'Simulação — Série Geometria (área e perímetro)',
    days: () => {
      const { perimetroSlides } = require('./perimetro.js');
      const { areaSlides } = require('./area.js');
      const { aplicacaoGeometriaSlides } = require('./aplicacao-geometria.js');
      const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8').trim();
      return [
        { type: 'video', dayLabel: 'Dia 1 — Reel', status: 'published', videoPath: 'dia-01-terrenos/reel-terrenos.mp4', caption: read('serie-geometria/dia-01-terrenos/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 2 — Carrossel', status: 'published', id: 'd2', slides: perimetroSlides, caption: read('serie-geometria/dia-02-perimetro/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 3 — Carrossel', status: 'published', id: 'd3', slides: areaSlides, caption: read('serie-geometria/dia-03-area/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 4 — Carrossel', status: 'published', id: 'd4', slides: aplicacaoGeometriaSlides, caption: read('serie-geometria/dia-04-aplicacao/legenda.txt') },
      ];
    },
    outDir: 'serie-geometria',
  },
  espacial: {
    title: 'Simulação — Série Geometria Espacial (volumes)',
    days: () => {
      const { volumeCuboSlides } = require('./volume-cubo.js');
      const { volumeCilindroSlides } = require('./volume-cilindro.js');
      const { volumeEsferaSlides } = require('./volume-esfera.js');
      const { aplicacaoVolumeSlides } = require('./aplicacao-volume.js');
      const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8').trim();
      return [
        { type: 'video', dayLabel: 'Dia 1 — Reel', status: 'ready', videoPath: 'dia-01-volume-intro/reel-volume-intro.mp4', caption: read('serie-geometria-espacial/dia-01-volume-intro/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 2 — Carrossel', status: 'ready', id: 'e2', slides: volumeCuboSlides, caption: read('serie-geometria-espacial/dia-02-cubo/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 3 — Carrossel', status: 'ready', id: 'e3', slides: volumeCilindroSlides, caption: read('serie-geometria-espacial/dia-03-cilindro/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 4 — Carrossel', status: 'ready', id: 'e4', slides: volumeEsferaSlides, caption: read('serie-geometria-espacial/dia-04-esfera/legenda.txt') },
        { type: 'carousel', dayLabel: 'Dia 5 — Carrossel', status: 'ready', id: 'e5', slides: aplicacaoVolumeSlides, caption: read('serie-geometria-espacial/dia-05-aplicacao/legenda.txt') },
      ];
    },
    outDir: 'serie-geometria-espacial',
  },
};

const slug = process.argv[2];
if (!slug || !THEMES[slug]) throw new Error('usage: node gen-preview-tema.js <slug>  (temas disponíveis: ' + Object.keys(THEMES).join(', ') + ')');
const theme = THEMES[slug];
const html = buildThemePreview({ title: theme.title, days: theme.days() });
const outPath = path.join(__dirname, theme.outDir, 'preview-tema.html');
fs.writeFileSync(outPath, html);
console.log('wrote', outPath);
