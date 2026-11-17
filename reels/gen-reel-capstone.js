// Reel capstone (Dia 5): construção do gráfico de f(x) = x² − 4x + 3 em 6 etapas. Sem áudio/legenda.
// Números conferidos com: node .claude/skills/math-content-check/scripts/quadratic.js 1 -4 3
const fs = require('fs');
const path = require('path');
const A = 1, B = -4, C = 3;
const f = (x) => A * x * x + B * x + C;
const delta = B * B - 4 * A * C;                 // 4
const roots = [(-B - Math.sqrt(delta)) / (2 * A), (-B + Math.sqrt(delta)) / (2 * A)]; // 1, 3
const xv = -B / (2 * A), yv = f(xv);              // 2, -1
if (delta !== 4 || roots[0] !== 1 || roots[1] !== 3 || xv !== 2 || yv !== -1 || f(0) !== 3 || f(4) !== 3) throw new Error('conta não bate');

const T = { PRIMARY: '#306898', LIGHT: '#577C8D', DARK: '#1F2937', YELLOW: '#FACC15', Y2: '#FFCE3D', BG: '#14171B' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const ICON = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

// escala do gráfico
const GW = 444, GH = 400, S = 62, XMIN = -1, YMAX = 4.6;
const X = (x) => (x - XMIN) * S + 12;
const Y = (y) => (YMAX - y) * S + 8;

// cenas (ms)
const SC = [
  { s: 0, e: 8000 }, { s: 8000, e: 16000 }, { s: 16000, e: 26000 },
  { s: 26000, e: 35000 }, { s: 35000, e: 44000 }, { s: 44000, e: 56000 },
];
const TOTAL = 56000;
const d = (ms) => `animation-delay:${ms}ms;`;

const pts = [];
for (let x = -0.9; x <= 4.95; x += 0.05) pts.push([x, f(x)]);
const curve = pts.filter(([, y]) => y <= YMAX && y >= -1.4).map(([x, y], i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');

function dot(x, y, label, at, color, lx = 10, ly = -10) {
  return `<g class="pop" style="${d(at)}transform-origin:${X(x)}px ${Y(y)}px;">
    <circle cx="${X(x)}" cy="${Y(y)}" r="8" fill="${color}" stroke="#14171B" stroke-width="2.5"/>
    <text x="${X(x) + lx}" y="${Y(y) + ly}" class="pt" fill="${color}">${label}</text></g>`;
}

const graph = `
<svg class="graph" width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}">
  <g class="reveal" style="${d(SC[1].s + 300)}">
    <line x1="0" y1="${Y(0)}" x2="${GW}" y2="${Y(0)}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${GH}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
    <text x="${GW - 14}" y="${Y(0) + 20}" class="ax">x</text>
    <text x="${X(0) + 10}" y="16" class="ax">y</text>
    ${[1, 2, 3, 4].map(k => `<text x="${X(k)}" y="${Y(0) + 20}" class="tick" text-anchor="middle">${k}</text>`).join('')}
  </g>
  <!-- eixo de simetria x = 2 -->
  <line class="reveal" style="${d(SC[4].s + 2600)}" x1="${X(2)}" y1="${Y(-1.3)}" x2="${X(2)}" y2="${Y(4.4)}" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="6 6"/>
  <!-- linha y = 3 -->
  <line class="reveal" style="${d(SC[4].s + 2000)}" x1="${X(0)}" y1="${Y(3)}" x2="${X(4)}" y2="${Y(3)}" stroke="rgba(250,204,21,.5)" stroke-width="2" stroke-dasharray="3 7"/>
  <!-- parábola -->
  <path class="draw" pathLength="1" style="${d(SC[5].s + 900)}" d="${curve}" fill="none" stroke="${T.YELLOW}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  ${dot(1, 0, '(1, 0)', SC[2].s + 5200, '#7DD3FC', -30, -16)}
  ${dot(3, 0, '(3, 0)', SC[2].s + 6200, '#7DD3FC', -30, -16)}
  ${dot(2, -1, '(2, −1)', SC[3].s + 5200, '#F9A8D4', 12, 6)}
  ${dot(0, 3, '(0, 3)', SC[4].s + 800, T.Y2, 12, -10)}
  ${dot(4, 3, '(4, 3)', SC[4].s + 3400, T.Y2, -66, -12)}
</svg>`;

const sc = (i, tag, title, body) => {
  const { s, e } = SC[i];
  return `<section class="scene" style="animation-delay:${s}ms;animation-duration:${e - s}ms;">
    <div class="tag">Etapa ${i + 1} de 6</div><h2>${title}</h2>${body}</section>`;
};
const steps = [
  sc(0, '', 'Identifique <span class="hl">a, b e c</span>', `
    <div class="eq">f(x) = x² − 4x + 3</div>
    <div class="abc">
      <span class="reveal" style="${d(2200)}"><b>a</b> = 1</span>
      <span class="reveal" style="${d(3600)}"><b>b</b> = −4</span>
      <span class="reveal" style="${d(5000)}"><b>c</b> = 3</span>
    </div>`),
  sc(1, '', 'Concavidade: <span class="hl">a &gt; 0</span>', `
    <div class="big reveal" style="${d(1800)}">a = 1 &gt; 0</div>
    <p class="note reveal" style="${d(3200)}">Parábola com a <b>boca para cima</b>.</p>`),
  sc(2, '', 'As <span class="hl">raízes</span>: onde f(x) = 0', `
    <div class="mono reveal" style="${d(800)}">Δ = (−4)² − 4·1·3 = <b>4</b></div>
    <div class="mono reveal" style="${d(2400)}">x = (4 ± 2) / 2</div>
    <div class="mono reveal" style="${d(4000)}">x' = <b>3</b> &nbsp; x'' = <b>1</b></div>`),
  sc(3, '', 'O <span class="hl">vértice</span>', `
    <div class="mono reveal" style="${d(800)}">xv = −b / 2a = 4 / 2 = <b>2</b></div>
    <div class="mono reveal" style="${d(2600)}">yv = 2² − 4·2 + 3 = <b>−1</b></div>
    <div class="mono reveal" style="${d(4000)}">V = (2, −1)</div>`),
  sc(4, '', 'Intercepto Y e <span class="hl">simétrico</span>', `
    <div class="mono reveal" style="${d(300)}">f(0) = c = <b>3</b> → (0, 3)</div>
    <div class="mono reveal" style="${d(2800)}">simétrico em x = 2 → (4, 3)</div>`),
  sc(5, '', 'Agora é só <span class="hl">ligar os pontos</span>', `
    <p class="note reveal" style="${d(5200)}">Uma parábola passando por todos eles.</p>`),
].join('');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{margin:0;width:540px;height:960px;overflow:hidden;background:${T.BG};font-family:'Public Sans',system-ui,sans-serif}
.stage{position:relative;width:540px;height:960px;background-image:${GRADIENT},linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:cover,30px 30px,30px 30px}
.reveal{opacity:0;transform:translateY(14px);animation:up .6s cubic-bezier(.2,.7,.3,1) forwards}
.pop{opacity:0;transform:scale(.6);animation:popin .5s cubic-bezier(.3,1.4,.4,1) forwards}
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:dr 6s ease-in-out forwards}
@keyframes up{to{opacity:1;transform:none}}
@keyframes popin{to{opacity:1;transform:scale(1)}}
@keyframes dr{to{stroke-dashoffset:0}}
@keyframes sc{0%{opacity:0;transform:translateY(12px)}6%{opacity:1;transform:none}92%{opacity:1}100%{opacity:0}}
.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:14px}.logo img{width:44px}
.logo span{font-family:Archivo;font-weight:900;font-size:22px;color:#fff}.logo i{font-style:normal;color:${T.YELLOW}}
.handle{font-family:'JetBrains Mono';font-size:13px;color:rgba(255,255,255,.6)}
.scenes{position:absolute;top:236px;left:48px;right:48px;height:150px}
.scene{position:absolute;inset:0;opacity:0;animation:sc linear both}
.tag{font-family:'JetBrains Mono';font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6)}
h2{margin:6px 0 10px;font-family:Archivo;font-weight:900;font-size:27px;line-height:1.15;color:#fff}
.hl{background:${T.YELLOW};color:${T.DARK};padding:0 7px;border-radius:4px}
.eq,.mono,.big{font-family:'JetBrains Mono';font-weight:600;color:#fff;font-size:19px;margin:4px 0}
.mono b,.big{color:${T.Y2}} .eq{font-size:26px}.big{font-size:30px}
.abc{display:flex;gap:14px;margin-top:8px}.abc span{font-family:'JetBrains Mono';font-size:22px;font-weight:700;color:#fff;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.2);padding:6px 14px;border-radius:10px}.abc b{color:${T.Y2}}
.note{font-size:20px;color:rgba(255,255,255,.85);margin:6px 0}.note b{color:${T.Y2}}
.gwrap{position:absolute;top:410px;left:48px;width:444px;height:420px;background:rgba(0,0,0,.26);border:1px solid rgba(255,255,255,.16);border-radius:20px;overflow:hidden}
.graph{position:absolute;left:0;top:10px}
.pt{font-family:'JetBrains Mono';font-size:15px;font-weight:700}
.ax{font-family:'JetBrains Mono';font-size:15px;fill:rgba(255,255,255,.7)}.tick{font-family:'JetBrains Mono';font-size:12px;fill:rgba(255,255,255,.5)}
.end{position:absolute;bottom:60px;left:48px;right:48px;font-family:Archivo;font-weight:900;font-size:26px;color:${T.Y2};opacity:0;animation:up .6s forwards}
</style></head><body><div class="stage">
<div class="header"><div class="logo"><img src="${ICON}" alt=""><span><i>Σ</i>RIC</span></div><span class="handle">@professor.eric</span></div>
<div class="scenes">${steps}</div>
<div class="gwrap">${graph}</div>
<div class="end" style="${d(SC[5].s + 8200)}">f(x) = x² − 4x + 3</div>
</div></body></html>`;

fs.writeFileSync(path.join(__dirname, 'reel-capstone.html'), html);
fs.writeFileSync(path.join(__dirname, 'reel-capstone.meta.json'), JSON.stringify({ totalMs: TOTAL }));
console.log('ok', TOTAL);
