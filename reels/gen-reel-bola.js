const fs = require('fs');
const path = require('path');

const T = {
  PRIMARY: '#306898', LIGHT: '#577C8D', DARK: '#1F2937',
  YELLOW: '#FACC15', YELLOW_TINT: '#FFCE3D', DARK_BG: '#14171B', CHALK: '#F1EFE6',
};
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif";
const FONT_BODY = "'Public Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const HANDLE = '@professor.eric';
const ICON_B64 = fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();
const ICON_SRC = `data:image/png;base64,${ICON_B64}`;

function logoLockup() {
  return `<div style="display:flex;align-items:center;gap:14px;">
    <img src="${ICON_SRC}" alt="" style="flex:none;width:44px;height:auto;display:block;">
    <span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;letter-spacing:-0.01em;line-height:1;white-space:nowrap;"><span style="color:${T.YELLOW};">Σ</span><span style="color:#fff;">RIC</span></span>
  </div>`;
}

// parabola sample points: t 0..1, h(t)=4t(1-t), mapped into a 380x300 plot area
const PTS = [];
for (let i = 0; i <= 10; i++) {
  const t = i / 10;
  const h = 4 * t * (1 - t);
  PTS.push({ x: 40 + 380 * t, y: 360 - 300 * h });
}
const pathD = 'M' + PTS.map(p => `${p.x},${p.y}`).join(' L');

const GRAPH_START = 1500;
const GRAPH_DUR = 4000;
const T_LANCAMENTO = GRAPH_START + 150;
const T_ALTURA_MAX = GRAPH_START + GRAPH_DUR * 0.5 - 150;
const T_QUEDA = GRAPH_START + GRAPH_DUR - 300;
const T_FOOTER = GRAPH_START + GRAPH_DUR + 500;
const T_CTA = T_FOOTER + 1500;
const TOTAL_MS = T_CTA + 2200;

const ballKeyframes = PTS.map((p, i) => `${i * 10}% { transform: translate(${p.x}px, ${p.y}px); }`).join('\n    ');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
  .stage{ position:relative;width:540px;height:960px;background:${GRADIENT};
    background-image:${GRADIENT},linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px);
    background-size:cover,30px 30px,30px 30px; }
  .reveal{ opacity:0; transform:translateY(16px); animation:up 0.6s cubic-bezier(.2,.7,.3,1) forwards; }
  .pop{ opacity:0; transform:scale(0.92); animation:popin 0.5s cubic-bezier(.3,1.4,.4,1) forwards; }
  @keyframes up{ to{ opacity:1; transform:translateY(0); } }
  @keyframes popin{ to{ opacity:1; transform:scale(1); } }

  /* top:170px deixa espaço livre da área onde o Instagram sobrepõe avatar/usuário nos Reels — nunca coloque cabeçalho/texto antes disso */
  .header{ position:absolute; top:170px; left:48px; right:48px; display:flex; align-items:center; justify-content:space-between; }
  .tag{ font-family:${FONT_MONO}; font-size:13px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.65); }
  .headline{ position:absolute; top:212px; left:48px; right:48px; margin:0; font-family:${FONT_HEAD}; font-weight:900; font-size:36px; line-height:1.18; letter-spacing:-0.01em; color:#fff; }

  .graphwrap{ position:absolute; top:360px; left:48px; right:48px; height:330px; }
  .axis{ stroke:rgba(255,255,255,0.4); stroke-width:2; }
  .parabola{ fill:none; stroke:${T.YELLOW_TINT}; stroke-width:5; stroke-linecap:round; stroke-linejoin:round;
    stroke-dasharray:1100; stroke-dashoffset:1100; animation:draw ${GRAPH_DUR}ms linear forwards; animation-delay:${GRAPH_START}ms; }
  @keyframes draw{ to{ stroke-dashoffset:0; } }
  .ball{ transform:translate(${PTS[0].x}px, ${PTS[0].y}px); animation:ball ${GRAPH_DUR}ms linear forwards; animation-delay:${GRAPH_START}ms; }
  @keyframes ball{ ${ballKeyframes} }
  .axislabel{ font-family:${FONT_MONO}; font-size:13px; fill:rgba(255,255,255,0.5); }
  .ptlabel{ position:absolute; font-family:${FONT_MONO}; font-size:13px; font-weight:600; color:${T.YELLOW_TINT}; opacity:0; animation:up 0.5s cubic-bezier(.2,.7,.3,1) forwards; white-space:nowrap; }

  /* ancorado pelo fundo (não pelo topo) pra sempre ficar logo acima do CTA */
  .footer{ position:absolute; bottom:148px; left:48px; right:48px; margin:0; font-family:${FONT_BODY}; font-size:17px; line-height:1.4; color:rgba(255,255,255,0.82); }

  .cta{ position:absolute; bottom:48px; left:48px; right:48px; display:flex; flex-direction:column; gap:18px; }
  .cta-pill{ display:inline-flex; align-self:flex-start; align-items:center; padding:12px 22px; background:${T.YELLOW}; color:${T.DARK}; font-family:${FONT_BODY}; font-weight:700; font-size:15px; border-radius:30px; }
</style>
</head>
<body>
<div class="stage">
  <div class="header reveal" style="animation-delay:150ms;">
    ${logoLockup()}
    <span class="tag">Matemática no dia a dia</span>
  </div>

  <h1 class="headline reveal" style="animation-delay:500ms;">Toda vez que algo sobe e desce, tem uma parábola por trás.</h1>

  <div class="graphwrap">
    <svg viewBox="0 0 460 400" width="100%" height="100%">
      <line class="axis" x1="40" y1="360" x2="440" y2="360" />
      <line class="axis" x1="40" y1="360" x2="40" y2="10" />
      <text class="axislabel" x="400" y="382">tempo</text>
      <text class="axislabel" x="8" y="20">altura</text>
      <path class="parabola" d="${pathD}" />
      <circle class="ball" r="9" fill="#fff" />
    </svg>
    <span class="ptlabel" style="left:2%; top:88%; animation-delay:${T_LANCAMENTO}ms;">lançamento</span>
    <span class="ptlabel" style="left:40%; top:9%; animation-delay:${T_ALTURA_MAX}ms;">altura máxima</span>
    <span class="ptlabel" style="right:2%; top:76%; animation-delay:${T_QUEDA}ms;">queda</span>
  </div>

  <p class="footer reveal" style="animation-delay:${T_FOOTER}ms;">É a mesma forma que aparece no lucro de um produto, na área de um terreno, na trajetória de uma ponte.</p>

  <div class="cta reveal" style="animation-delay:${T_CTA}ms;">
    <div class="cta-pill">Segue pra entender cada parte dessa conta</div>
    <span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,0.55);">${HANDLE}</span>
  </div>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'reel-bola.html'), html);
fs.writeFileSync(path.join(__dirname, 'reel-bola.meta.json'), JSON.stringify({ totalMs: TOTAL_MS }));
console.log('wrote reel-bola.html, total', TOTAL_MS, 'ms');
