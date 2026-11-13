const fs = require('fs');
const path = require('path');

const T = {
  PRIMARY: '#306898',
  LIGHT: '#577C8D',
  DARK: '#1F2937',
  YELLOW: '#FACC15',
  YELLOW_TINT: '#FFCE3D',
  DARK_BG: '#14171B',
  CHALK: '#F1EFE6',
};
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif";
const FONT_BODY = "'Public Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

const HANDLE = '@professor.eric';
const ICON_B64 = fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();
const ICON_SRC = `data:image/png;base64,${ICON_B64}`;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function logoLockup() {
  return `
  <div style="display:flex;align-items:center;gap:14px;">
    <img src="${ICON_SRC}" alt="" style="flex:none;width:44px;height:auto;display:block;">
    <span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;letter-spacing:-0.01em;line-height:1;white-space:nowrap;"><span style="color:${T.YELLOW};">Σ</span><span style="color:#fff;">RIC</span></span>
  </div>`;
}

// Builds one 9:16 animated "resolução" reel. `rows` is 2-3 { op?, value, note, highlight? }.
function generateReel({ slug, tag, headline, headlineHighlight, rows, footer, ctaText }) {
  const T0_HEADER = 150;
  const T1_HEADLINE = 500;
  const rowDelays = rows.map((_, i) => 1500 + i * 1500);
  const noteDelays = rowDelays.map((d) => d + 700);
  const T5_FOOTER = rowDelays[rowDelays.length - 1] + 1600;
  const T6_CTA = T5_FOOTER + 1300;
  const TOTAL_MS = T6_CTA + 1800;

  const headlineHtml = headlineHighlight
    ? esc(headline).replace(esc(headlineHighlight), `<span class="highlight">${esc(headlineHighlight)}</span>`)
    : esc(headline);

  const rowsHtml = rows.map((r, i) => {
    const opHtml = r.op
      ? `<span class="op${r.highlight ? ' hl' : ''}${i > 0 ? ' reveal' : ''}" style="${i > 0 ? `animation-delay:${rowDelays[i]}ms;` : ''}">${esc(r.op)}</span>`
      : `<span class="op"></span>`;
    const valHtml = `<span class="val${r.highlight ? ' hl' : ''}${i > 0 ? ' reveal' : ''}" style="${i > 0 ? `animation-delay:${rowDelays[i]}ms;` : ''}">${esc(r.value)}</span>`;
    const rowClass = i === 0 ? 'row reveal' : 'row';
    const rowStyle = i === 0 ? `animation-delay:${rowDelays[0]}ms;` : '';
    return `
    <div class="${rowClass}" style="${rowStyle}">
      <div class="row-top">${opHtml}${valHtml}</div>
      <span class="note${i > 0 ? ' reveal' : ''}" style="${i > 0 ? `animation-delay:${noteDelays[i]}ms;` : ''}">${esc(r.note)}</span>
    </div>`;
  }).join('');

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
  .stage{
    position:relative;width:540px;height:960px;background:${GRADIENT};
    background-image:${GRADIENT},linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px);
    background-size:cover,30px 30px,30px 30px;
  }
  .reveal{ opacity:0; transform:translateY(16px); animation:up 0.6s cubic-bezier(.2,.7,.3,1) forwards; }
  .pop{ opacity:0; transform:scale(0.92); animation:popin 0.5s cubic-bezier(.3,1.4,.4,1) forwards; }
  @keyframes up{ to{ opacity:1; transform:translateY(0); } }
  @keyframes popin{ to{ opacity:1; transform:scale(1); } }

  .header{ position:absolute; top:48px; left:48px; right:48px; display:flex; align-items:center; justify-content:space-between; }
  .tag{ font-family:${FONT_MONO}; font-size:13px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.65); }
  .headline{ position:absolute; top:110px; left:48px; right:48px; margin:0; font-family:${FONT_HEAD}; font-weight:900; font-size:42px; line-height:1.2; letter-spacing:-0.01em; color:#fff; }
  .highlight{ background:${T.YELLOW}; color:${T.DARK}; padding:0 8px; border-radius:4px; }

  .card{ position:absolute; top:291px; left:48px; right:48px; padding:22px 34px; background:rgba(0,0,0,0.26); border:1px solid rgba(255,255,255,0.16); border-radius:20px; }
  .row{ display:flex; flex-direction:column; gap:6px; padding:14px 0; }
  .row + .row{ border-top:1px solid rgba(255,255,255,0.14); }
  .row-top{ display:flex; align-items:baseline; gap:18px; }
  .op{ font-family:${FONT_MONO}; font-size:24px; font-weight:700; color:rgba(255,255,255,0.55); min-width:72px; }
  .op.hl{ color:${T.YELLOW_TINT}; }
  .val{ font-family:${FONT_MONO}; font-size:32px; font-weight:700; color:#fff; }
  .val.hl{ font-size:38px; font-weight:800; color:${T.YELLOW_TINT}; }
  .note{ font-family:${FONT_BODY}; font-size:17px; line-height:1.3; color:rgba(255,255,255,0.62); }

  .footer{ position:absolute; top:722px; left:48px; right:48px; margin:0; font-family:${FONT_HEAD}; font-weight:900; font-size:32px; line-height:1.3; color:${T.YELLOW_TINT}; }

  .cta{ position:absolute; bottom:48px; left:48px; right:48px; display:flex; flex-direction:column; gap:18px; }
  .cta-pill{ display:inline-flex; align-self:flex-start; align-items:center; padding:12px 22px; background:${T.YELLOW}; color:${T.DARK}; font-family:${FONT_BODY}; font-weight:700; font-size:15px; border-radius:30px; }
</style>
</head>
<body>
<div class="stage">
  <div class="header reveal" style="animation-delay:${T0_HEADER}ms;">
    ${logoLockup()}
    <span class="tag">${esc(tag)}</span>
  </div>

  <h1 class="headline reveal" style="animation-delay:${T1_HEADLINE}ms;">${headlineHtml}</h1>

  <div class="card">
    ${rowsHtml}
  </div>

  <p class="footer pop" style="animation-delay:${T5_FOOTER}ms;">${esc(footer)}</p>

  <div class="cta reveal" style="animation-delay:${T6_CTA}ms;">
    <div class="cta-pill">${esc(ctaText)}</div>
    <span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,0.55);">${HANDLE}</span>
  </div>
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, `reel-${slug}.html`), html);
  fs.writeFileSync(path.join(__dirname, `reel-${slug}.meta.json`), JSON.stringify({ totalMs: TOTAL_MS }));
  console.log('wrote reel-' + slug + '.html, total', TOTAL_MS, 'ms');
}

module.exports = { generateReel };

if (require.main === module) {
  generateReel({
    slug: 'bhaskara',
    tag: 'Resolução',
    headline: 'Antes de resolver, o Δ já conta quantas respostas existem.',
    headlineHighlight: 'quantas respostas existem',
    rows: [
      { value: 'x² − 5x + 6 = 0', note: 'a equação' },
      { op: 'Δ =', value: '(−5)² − 4·1·6', note: 'substituindo a, b e c na fórmula' },
      { op: 'Δ =', value: '1', note: 'maior que zero: duas raízes reais diferentes', highlight: true },
    ],
    footer: 'x = 2 e x = 3.',
    ctaText: 'Manda a resposta nos comentários',
  });
}
