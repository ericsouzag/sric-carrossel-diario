// Dia 5 — Reel capstone: construção completa do gráfico de f(x) = x² − 4x + 3 (sem áudio/legenda; o professor narra por fora).
// Valores conferidos com: node .claude/skills/math-content-check/scripts/quadratic.js 1 -4 3
//  Δ=4 | raízes 1 e 3 | vértice (2,-1) | y-intercepto (0,3) | simétrico (4,3)
const fs = require('fs');
const path = require('path');

const T = { PRIMARY:'#306898', LIGHT:'#577C8D', DARK:'#1F2937', YELLOW:'#FACC15', YELLOW_TINT:'#FFCE3D', DARK_BG:'#14171B' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif";
const FONT_BODY = "'Public Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const HANDLE = '@professor.eric';
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

const A = 1, B = -4, C = 3;
const f = (x) => A * x * x + B * x + C;
// Plano: x de -1 a 5, y de -2 a 4, 60px por unidade (escala igual nos dois eixos)
const U = 60, OX = 42, XMIN = -1, YMAX = 4;
const px = (x) => +(OX + (x - XMIN) * U).toFixed(2);
const py = (y) => +((YMAX - y) * U).toFixed(2);

// Pontos (todos conferidos contra f)
const P = {
  r1: { x: 1, y: 0 }, r2: { x: 3, y: 0 }, v: { x: 2, y: -1 }, c: { x: 0, y: 3 }, s: { x: 4, y: 3 },
};
for (const [k, p] of Object.entries(P)) if (Math.abs(f(p.x) - p.y) > 1e-9) throw new Error('ponto fora da curva: ' + k);

// Parábola: de 2-√5 a 2+√5 (onde f = 4, topo do gráfico) — amostrada de f(x)
const x0 = 2 - Math.sqrt(5), x1 = 2 + Math.sqrt(5);
const pts = [];
for (let i = 0; i <= 60; i++) { const x = x0 + (x1 - x0) * i / 60; pts.push(`${px(x)},${py(f(x))}`); }
const parabolaD = 'M' + pts.join(' L');

// Cenas
const HEAD_END = 1200;
const dur = [8000, 8000, 10000, 10000, 9000, 9000];
const start = []; dur.reduce((t, d, i) => { start[i] = t; return t + d; }, HEAD_END);
const T_CTA = HEAD_END + dur.reduce((a, b) => a + b, 0);
const TOTAL_MS = T_CTA + 3000; // ~57,2 s

const S = (i, off = 0) => start[i] + off;

function scene(i, tag, title, panelHtml) {
  return `<div class="scene" style="animation-duration:${dur[i]}ms;animation-delay:${start[i]}ms;">
    <div class="step"><span class="num">${i + 1}</span><span class="tag">Etapa ${i + 1} de 6</span></div>
    <h2 class="title">${title}</h2>
    <div class="panel">${panelHtml}</div>
  </div>`;
}
const row = (html, delay, cls = '') => `<div class="prow reveal ${cls}" style="animation-delay:${delay}ms;">${html}</div>`;
const chip = (l, v, d) => `<div class="chip pop" style="animation-delay:${d}ms;"><span class="cl">${l}</span><span class="cv">${v}</span></div>`;

const scenes = [
  scene(0, '', 'Identifique <span class="hl">a</span>, <span class="hl">b</span> e <span class="hl">c</span>',
    `<div class="chips">${chip('a', '1', S(0, 900))}${chip('b', '−4', S(0, 2400))}${chip('c', '3', S(0, 3900))}</div>
     ${row('<span class="muted">f(x) = <b>1</b>x² <b>− 4</b>x <b>+ 3</b></span>', S(0, 5400))}`),
  scene(1, '', 'Concavidade: pra <span class="hl">cima</span>',
    `${row('<span class="big">a = 1 &gt; 0</span>', S(1, 900))}
     ${row('<span class="muted">a positivo → a parábola abre pra cima</span>', S(1, 2800))}
     <svg class="cup pop" style="animation-delay:${S(1, 4200)}ms;" viewBox="0 0 80 50" width="80" height="50"><path d="M10 6 Q40 76 70 6" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="5" stroke-linecap="round"/></svg>`),
  scene(2, '', 'Raízes: onde corta o eixo x',
    `${row('<span class="mono">x² − 4x + 3 = 0</span>', S(2, 700))}
     ${row('<span class="mono">Δ = (−4)² − 4·1·3 = <b>4</b></span>', S(2, 2200))}
     ${row('<span class="mono">x = (4 ± 2) ÷ 2</span>', S(2, 4000))}
     ${row('<span class="mono key">x = 1  e  x = 3</span>', S(2, 5800), 'keyrow')}`),
  scene(3, '', 'Vértice: o ponto mais baixo',
    `${row('<span class="mono">xᵥ = −b ÷ 2a = 4 ÷ 2 = <b>2</b></span>', S(3, 700))}
     ${row('<span class="mono">yᵥ = f(2) = 4 − 8 + 3 = <b>−1</b></span>', S(3, 3000))}
     ${row('<span class="mono key">vértice (2, −1)</span>', S(3, 5400), 'keyrow')}`),
  scene(4, '', 'Intercepto Y e o ponto simétrico',
    `${row('<span class="mono">f(0) = 3 → <b>(0, 3)</b></span>', S(4, 700))}
     ${row('<span class="mono">eixo de simetria: x = 2</span>', S(4, 2600))}
     ${row('<span class="mono key">simétrico de (0, 3) → (4, 3)</span>', S(4, 4800), 'keyrow')}`),
  scene(5, '', 'Agora liga os pontos',
    `${row('<span class="big">f(x) = x² − 4x + 3</span>', S(5, 3600))}
     ${row('<span class="muted">raízes 1 e 3 · vértice (2, −1) · corta y em 3</span>', S(5, 5000))}`),
];

// Elementos do gráfico (SVG)
const dot = (p, delay, color = T.YELLOW_TINT) =>
  `<g class="pop svgpop" style="animation-delay:${delay}ms;"><circle cx="${px(p.x)}" cy="${py(p.y)}" r="15" fill="${color}" opacity="0.25"/><circle cx="${px(p.x)}" cy="${py(p.y)}" r="8" fill="${color}" stroke="#fff" stroke-width="2"/></g>`;
const lbl = (txt, x, y, delay, anchor = 'middle') =>
  `<text class="reveal ptl" style="animation-delay:${delay + 200}ms;" x="${x}" y="${y}" text-anchor="${anchor}">${txt}</text>`;

let ticks = '';
for (let x = -1; x <= 5; x++) ticks += `<line class="grid" x1="${px(x)}" y1="0" x2="${px(x)}" y2="360"/>`;
for (let y = -2; y <= 4; y++) ticks += `<line class="grid" x1="${OX}" y1="${py(y)}" x2="${OX + 360}" y2="${py(y)}"/>`;

const graph = `
<svg viewBox="0 0 444 360" width="444" height="360" style="overflow:visible">
  ${ticks}
  <line class="axis" x1="${OX}" y1="${py(0)}" x2="${OX + 360}" y2="${py(0)}"/>
  <line class="axis" x1="${px(0)}" y1="0" x2="${px(0)}" y2="360"/>
  <text class="axl" x="${OX + 362}" y="${py(0) + 4}">x</text>
  <text class="axl" x="${px(0) + 8}" y="10">y</text>
  <!-- Etapa 2: setas "abre pra cima" -->
  <g class="cueup" style="animation-duration:${dur[1]}ms;animation-delay:${S(1, 600)}ms;">
    <path d="M${px(0.6)} ${py(-0.2)} L${px(0.6)} ${py(1.4)} M${px(0.6) - 9} ${py(1.4) + 14} L${px(0.6)} ${py(1.4)} L${px(0.6) + 9} ${py(1.4) + 14}" />
    <path d="M${px(3.4)} ${py(-0.2)} L${px(3.4)} ${py(1.4)} M${px(3.4) - 9} ${py(1.4) + 14} L${px(3.4)} ${py(1.4)} L${px(3.4) + 9} ${py(1.4) + 14}" />
  </g>
  <!-- Etapa 5: eixo de simetria -->
  <line class="sym reveal" style="animation-delay:${S(4, 2600)}ms;" x1="${px(2)}" y1="0" x2="${px(2)}" y2="360"/>
  <!-- Etapa 6: parábola -->
  <path class="parab" pathLength="1" d="${parabolaD}" style="animation-delay:${S(5, 600)}ms;"/>
  ${dot(P.r1, S(2, 6000))}${dot(P.r2, S(2, 6600))}
  ${lbl('(1, 0)', px(1) - 6, py(0) + 26, S(2, 6000), 'end')}${lbl('(3, 0)', px(3) + 6, py(0) + 26, S(2, 6600), 'start')}
  ${dot(P.v, S(3, 5600))}
  ${lbl('(2, −1)', px(2), py(-1) + 30, S(3, 5600))}
  ${dot(P.c, S(4, 1200))}${dot(P.s, S(4, 5200))}
  ${lbl('(0, 3)', px(0) + 14, py(3) - 16, S(4, 1200), 'start')}${lbl('(4, 3)', px(4) + 14, py(3) - 16, S(4, 5200), 'start')}
</svg>`;

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
  .reveal{ opacity:0; transform:translateY(12px); animation:up 0.6s cubic-bezier(.2,.7,.3,1) forwards; }
  .pop{ opacity:0; transform:scale(0.92); animation:popin 0.5s cubic-bezier(.3,1.4,.4,1) forwards; }
  .svgpop{ transform-box:fill-box; transform-origin:center; transform:scale(0.3); }
  @keyframes up{ to{ opacity:1; transform:translateY(0); } }
  @keyframes popin{ to{ opacity:1; transform:scale(1); } }
  /* zona segura do Instagram: nada antes de top:170px */
  .header{ position:absolute; top:170px; left:48px; right:48px; display:flex; align-items:center; justify-content:space-between; }
  .htag{ font-family:${FONT_MONO}; font-size:13px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.65); }

  .scene{ position:absolute; inset:0; opacity:0; animation:sc linear both; pointer-events:none; }
  @keyframes sc{ 0%{opacity:0;} 4%{opacity:1;} 95%{opacity:1;} 100%{opacity:0;} }
  .step{ position:absolute; top:218px; left:48px; display:flex; align-items:center; gap:12px; }
  .num{ width:30px;height:30px;border-radius:50%;background:${T.YELLOW};color:${T.DARK};font-family:${FONT_HEAD};font-weight:900;font-size:17px;display:flex;align-items:center;justify-content:center; }
  .tag{ font-family:${FONT_MONO}; font-size:13px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:rgba(255,255,255,0.7); }
  .title{ position:absolute; top:256px; left:48px; right:48px; margin:0; font-family:${FONT_HEAD}; font-weight:900; font-size:30px; line-height:1.15; color:#fff; letter-spacing:-0.01em; }
  .hl{ background:${T.YELLOW}; color:${T.DARK}; padding:0 7px; border-radius:4px; }
  .panel{ position:absolute; top:752px; left:48px; right:48px; height:150px; display:flex; flex-direction:column; justify-content:flex-start; gap:6px; }
  .prow{ white-space:nowrap; }
  .mono{ font-family:${FONT_MONO}; font-size:19px; font-weight:600; color:#fff; }
  .mono b{ color:${T.YELLOW_TINT}; }
  .key{ color:${T.YELLOW_TINT}; }
  .keyrow{ margin-top:4px; }
  .big{ font-family:${FONT_MONO}; font-size:26px; font-weight:700; color:${T.YELLOW_TINT}; }
  .muted{ font-size:17px; color:rgba(255,255,255,0.82); font-family:${FONT_BODY}; }
  .muted b{ color:${T.YELLOW_TINT}; font-family:${FONT_MONO}; }
  .chips{ display:flex; gap:14px; }
  .chip{ display:flex; align-items:baseline; gap:10px; padding:8px 18px; background:rgba(0,0,0,0.28); border:1px solid rgba(255,255,255,0.2); border-radius:14px; }
  .cl{ font-family:${FONT_MONO}; font-size:20px; color:rgba(255,255,255,0.7); } .cv{ font-family:${FONT_MONO}; font-size:30px; font-weight:700; color:${T.YELLOW_TINT}; }
  .cup{ position:absolute; right:0; top:0; }

  .eq{ position:absolute; top:318px; left:48px; right:48px; font-family:${FONT_MONO}; font-size:21px; font-weight:700; color:rgba(255,255,255,0.9); }
  .graph{ position:absolute; top:360px; left:48px; width:444px; height:360px; background:rgba(0,0,0,0.22); border:1px solid rgba(255,255,255,0.14); border-radius:6px; }
  .grid{ stroke:rgba(255,255,255,0.09); stroke-width:1; }
  .axis{ stroke:rgba(255,255,255,0.55); stroke-width:2; }
  .axl{ font-family:${FONT_MONO}; font-size:14px; fill:rgba(255,255,255,0.6); }
  .ptl{ font-family:${FONT_MONO}; font-size:14px; font-weight:700; fill:${T.YELLOW_TINT}; paint-order:stroke; stroke:#16324a; stroke-width:4px; stroke-linejoin:round; }
  .cueup path{ fill:none; stroke:${T.YELLOW_TINT}; stroke-width:4; stroke-linecap:round; stroke-linejoin:round; }
  .cueup{ opacity:0; animation:sc linear both; }
  .sym{ stroke:rgba(255,255,255,0.5); stroke-width:2; stroke-dasharray:6 6; }
  .parab{ fill:none; stroke:${T.YELLOW}; stroke-width:5; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:1; stroke-dashoffset:1; opacity:0; animation:drawp 5200ms ease-in-out forwards; }
  @keyframes drawp{ 0%{opacity:1; stroke-dashoffset:1;} 100%{opacity:1; stroke-dashoffset:0;} }

  .cta{ position:absolute; bottom:48px; left:48px; right:48px; display:flex; flex-direction:column; gap:14px; }
  .cta-pill{ display:inline-flex; align-self:flex-start; padding:12px 22px; background:${T.YELLOW}; color:${T.DARK}; font-weight:700; font-size:15px; border-radius:30px; }
</style>
</head>
<body>
<div class="stage">
  <div class="header reveal" style="animation-delay:150ms;">
    <div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="flex:none;width:44px;height:auto;display:block;"><span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;line-height:1;"><span style="color:${T.YELLOW};">Σ</span><span style="color:#fff;">RIC</span></span></div>
    <span class="htag">Função do 2º grau</span>
  </div>
  <div class="eq reveal" style="animation-delay:500ms;">f(x) = x² − 4x + 3</div>
  <div class="graph reveal" style="animation-delay:700ms;">${graph}</div>
  ${scenes.join('\n')}
  <div class="cta reveal" style="animation-delay:${T_CTA}ms;">
    <div class="cta-pill">Salva esse passo a passo pra revisar</div>
    <span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,0.55);">${HANDLE}</span>
  </div>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'reel-grafico.html'), html);
fs.writeFileSync(path.join(__dirname, 'reel-grafico.meta.json'), JSON.stringify({ totalMs: TOTAL_MS }));
console.log('wrote reel-grafico.html, total', TOTAL_MS, 'ms');
