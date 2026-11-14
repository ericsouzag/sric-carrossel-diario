// Dia 5 — Reel capstone: construção completa do gráfico de f(x) = x² − 4x + 3 (sem áudio/legenda; usuário narra por fora)
// Números conferidos com: node .claude/skills/math-content-check/scripts/quadratic.js 1 -4 3
//   Δ=4, raízes 1 e 3, vértice (2,-1), Y-intercepto (0,3), simétrico (4,3)
const fs = require('fs');
const path = require('path');

const T = { PRIMARY:'#306898', LIGHT:'#577C8D', DARK:'#1F2937', YELLOW:'#FACC15', YELLOW_TINT:'#FFCE3D', DARK_BG:'#14171B' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif", FONT_BODY = "'Public Sans', system-ui, sans-serif", FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const HANDLE = '@professor.eric';
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

const A = 1, B = -4, C = 3;
const f = (x) => A * x * x + B * x + C;
// checagens de sanidade (falha o build se algo não bater com o texto dos slides)
const delta = B * B - 4 * A * C;
const r1 = (-B - Math.sqrt(delta)) / (2 * A), r2 = (-B + Math.sqrt(delta)) / (2 * A);
const xv = -B / (2 * A), yv = f(xv);
if (delta !== 4 || r1 !== 1 || r2 !== 3 || xv !== 2 || yv !== -1 || f(0) !== 3 || f(4) !== 3) throw new Error('conta não bate com o texto');

// gráfico
const U = 62, XMIN = -1.2, YMAX = 4.2, GW = 444, GH = 372;
const X = (x) => +((x - XMIN) * U).toFixed(1);
const Y = (y) => +((YMAX - y) * U).toFixed(1);

const logo = `<div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="flex:none;width:44px;height:auto;display:block;"><span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;letter-spacing:-0.01em;line-height:1;white-space:nowrap;"><span style="color:${T.YELLOW};">Σ</span><span style="color:#fff;">RIC</span></span></div>`;

// cenas (ms)
const S = [200, 9200, 18200, 27200, 36200, 45200];
const SDUR = [9000, 9000, 9000, 9000, 9000, 12800];
const TOTAL_MS = S[5] + SDUR[5] + 600;

const scene = (i, inner, footer) => `
  <div class="scene" style="animation-duration:${SDUR[i]}ms;animation-delay:${S[i]}ms;${i === 5 ? 'animation-name:scLast;' : ''}">${inner}</div>
  ${footer ? `<p class="footer scene" style="animation-duration:${SDUR[i]}ms;animation-delay:${S[i]}ms;">${footer}</p>` : ''}`;
const rv = (i, off, html, cls = '') => `<div class="line reveal ${cls}" style="animation-delay:${S[i] + off}ms;">${html}</div>`;
const title = (i, n, t) => `<h1 class="headline reveal" style="animation-delay:${S[i] + 100}ms;"><span class="step">${n}</span>${t}</h1>`;
const hl = (s) => `<span class="hl">${s}</span>`;

// pontos / elementos do gráfico com tempo de entrada
const pt = (x, y, label, anchor, dx, dy, delay, cls = '') => `
    <g class="pop" style="animation-delay:${delay}ms;"><circle cx="${X(x)}" cy="${Y(y)}" r="8" class="dot ${cls}"/>
    <text x="${X(x) + dx}" y="${Y(y) + dy}" text-anchor="${anchor}" class="ptl ${cls}">${label}</text></g>`;

const ticks = [];
for (let x = 1; x <= 5; x++) ticks.push(`<text x="${X(x)}" y="${Y(0) + 15}" text-anchor="middle" class="tick">${x}</text>`);
for (const y of [-1, 1, 2, 3, 4]) ticks.push(`<text x="${X(0) - 7}" y="${Y(y) + 4}" text-anchor="end" class="tick">${y}</text>`);

// parábola amostrada (x de -0.25 a 4.25 → y ≤ 4.2)
const PX = [];
for (let i = 0; i <= 90; i++) { const x = -0.25 + (4.5 * i) / 90; PX.push(`${X(x)},${Y(f(x))}`); }
const parab = 'M' + PX.join(' L');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}
html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
.stage{position:relative;width:540px;height:960px;background:${GRADIENT};background-image:${GRADIENT},linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px);background-size:cover,30px 30px,30px 30px;}
.reveal{opacity:0;transform:translateY(16px);animation:up 0.6s cubic-bezier(.2,.7,.3,1) forwards;}
.pop{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(0.6);animation:popin 0.5s cubic-bezier(.3,1.4,.4,1) forwards;}
@keyframes up{to{opacity:1;transform:translateY(0);}}
@keyframes popin{to{opacity:1;transform:scale(1);}}
@keyframes sc{0%{opacity:0;}4%{opacity:1;}93%{opacity:1;}100%{opacity:0;}}
@keyframes scLast{0%{opacity:0;}4%{opacity:1;}100%{opacity:1;}}
.scene{position:absolute;left:48px;right:48px;top:212px;opacity:0;animation-name:sc;animation-timing-function:linear;animation-fill-mode:forwards;}
.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between;}
.tag{font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.65);}
.headline{margin:0 0 12px;font-family:${FONT_HEAD};font-weight:900;font-size:28px;line-height:1.15;letter-spacing:-0.01em;color:#fff;}
.step{display:inline-block;background:${T.YELLOW};color:${T.DARK};padding:0 9px;border-radius:5px;margin-right:10px;}
.line{font-family:${FONT_MONO};font-weight:700;font-size:21px;line-height:1.5;color:#fff;white-space:nowrap;}
.line.big{font-size:30px;}
.line.dim{color:rgba(255,255,255,0.7);font-weight:500;font-size:19px;}
.hl{background:${T.YELLOW};color:${T.DARK};padding:0 7px;border-radius:4px;}
.hlt{color:${T.YELLOW_TINT};}
.graph{position:absolute;left:48px;top:408px;width:${GW}px;height:${GH}px;}
.axis{stroke:rgba(255,255,255,0.55);stroke-width:2;}
.grid{stroke:rgba(255,255,255,0.1);stroke-width:1;}
.tick{font-family:${FONT_MONO};font-size:12px;fill:rgba(255,255,255,0.5);}
.dot{fill:#fff;stroke:${T.DARK};stroke-width:2;} .dot.v{fill:${T.YELLOW};} .dot.r{fill:#7DD3FC;} .dot.s{fill:#fff;}
.ptl{font-family:${FONT_MONO};font-size:14px;font-weight:700;fill:#fff;paint-order:stroke;stroke:rgba(20,23,27,0.85);stroke-width:4px;} .ptl.v{fill:${T.YELLOW_TINT};} .ptl.r{fill:#7DD3FC;}
.curve{fill:none;stroke:${T.YELLOW_TINT};stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 7000ms cubic-bezier(.4,0,.6,1) forwards;animation-delay:${S[5] + 1200}ms;}
@keyframes draw{to{stroke-dashoffset:0;}}
.fade{opacity:0;animation:fadein 0.6s ease forwards;}
@keyframes fadein{to{opacity:1;}}
.sym{stroke:rgba(255,255,255,0.6);stroke-width:2;stroke-dasharray:6 6;}
.footer{top:auto;bottom:100px;margin:0;font-family:${FONT_BODY};font-size:18px;line-height:1.4;color:rgba(255,255,255,0.85);}
.cta{position:absolute;bottom:48px;left:48px;right:48px;display:flex;flex-direction:column;gap:14px;}
.cta-pill{display:inline-flex;align-self:flex-start;padding:12px 22px;background:${T.YELLOW};color:${T.DARK};font-family:${FONT_BODY};font-weight:700;font-size:15px;border-radius:30px;}
</style></head><body><div class="stage">
  <div class="header reveal" style="animation-delay:100ms;">${logo}<span class="tag" id="tag">Passo a passo</span></div>

  ${scene(0, title(0, 1, 'Identifique a, b e c') + rv(0, 700, 'f(x) = x² − 4x + 3', 'big') +
      rv(0, 2500, `${hl('a = 1')}`, '').replace('class="line', 'class="inl line') +
      rv(0, 4000, `${hl('b = −4')}`, '').replace('class="line', 'class="inl line') +
      rv(0, 5500, `${hl('c = 3')}`, '').replace('class="line', 'class="inl line'),
      'Cuidado com o sinal: o b é −4, não 4.')}
  ${scene(1, title(1, 2, 'Olhe o sinal do a') + rv(1, 800, `a = 1  →  ${hl('a > 0')}`) + rv(1, 2500, 'concavidade pra cima', '') + rv(1, 4000, 'a parábola abre como um sorriso', 'dim'),
      'Se o a fosse negativo, ela abriria pra baixo.')}
  ${scene(2, title(2, 3, 'Calcule as raízes') + rv(2, 700, 'Δ = (−4)² − 4·1·3 = 4') + rv(2, 2200, 'x = (4 ± 2) / 2') + rv(2, 3700, `${hl('x = 1')}  e  ${hl('x = 3')}`),
      'Raízes são onde a curva corta o eixo x: (1, 0) e (3, 0).')}
  ${scene(3, title(3, 4, 'Calcule o vértice') + rv(3, 700, 'xv = −b / 2a = 4 / 2 = 2') + rv(3, 2200, 'yv = f(2) = 4 − 8 + 3 = −1') + rv(3, 3700, `${hl('V = (2, −1)')}`),
      'Como a > 0, o vértice é o ponto mais baixo da curva.')}
  ${scene(4, title(4, 5, 'Intercepto Y e simétrico') + rv(4, 700, 'f(0) = c = 3  →  (0, 3)') + rv(4, 2200, 'espelho em x = 2  →  (4, 3)') + rv(4, 3700, 'f(4) = 16 − 16 + 3 = 3', 'dim'),
      'O ponto (4, 3) é o reflexo de (0, 3) pelo eixo x = 2.')}
  ${scene(5, title(5, 6, 'Ligue os pontos') + rv(5, 700, 'Agora a parábola passa por todos eles.') .replace('class="line', 'class="dim line') + rv(5, 8200, `f(x) = x² − 4x + 3`, 'big hlt'))}

  <svg class="graph" viewBox="0 0 ${GW} ${GH}" width="${GW}" height="${GH}">
    ${[1,2,3,4,5].map(x => `<line class="grid" x1="${X(x)}" y1="0" x2="${X(x)}" y2="${GH}"/>`).join('')}
    ${[-1,1,2,3,4].map(y => `<line class="grid" x1="0" y1="${Y(y)}" x2="${GW}" y2="${Y(y)}"/>`).join('')}
    <line class="axis" x1="0" y1="${Y(0)}" x2="${GW}" y2="${Y(0)}"/>
    <line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${GH}"/>
    <text x="${GW - 6}" y="${Y(0) - 8}" text-anchor="end" class="tick">x</text>
    <text x="${X(0) + 8}" y="12" class="tick">y</text>
    ${ticks.join('')}
    <!-- passo 2: selo de concavidade -->
    <g class="pop" style="animation-delay:${S[1] + 1800}ms;"><circle cx="${GW - 44}" cy="46" r="30" fill="rgba(0,0,0,0.35)" stroke="${T.YELLOW_TINT}" stroke-width="2"/><path d="M${GW - 62},32 Q${GW - 44},76 ${GW - 26},32" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="4" stroke-linecap="round"/></g>
    <!-- passo 6: parábola -->
    <path class="curve" pathLength="1" d="${parab}"/>
    <!-- passo 3: raízes -->
    ${pt(1, 0, '(1, 0)', 'end', -8, 24, S[2] + 4300, 'r')}
    ${pt(3, 0, '(3, 0)', 'start', 8, 24, S[2] + 5300, 'r')}
    <!-- passo 4: vértice -->
    ${pt(2, -1, '(2, −1)', 'middle', 0, 30, S[3] + 4300, 'v')}
    <!-- passo 5: eixo de simetria, intercepto, simétrico -->
    <line class="sym fade" x1="${X(2)}" y1="0" x2="${X(2)}" y2="${GH}" style="animation-delay:${S[4] + 2800}ms;"/>
    ${pt(0, 3, '(0, 3)', 'end', -14, 5, S[4] + 1300, 's')}
    ${pt(4, 3, '(4, 3)', 'start', 14, 5, S[4] + 3500, 's')}
  </svg>

  <div class="cta reveal" style="animation-delay:${S[5] + 9200}ms;">
    <div class="cta-pill">Salva pra revisar o passo a passo</div>
    <span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,0.55);">${HANDLE}</span>
  </div>
</div></body></html>`;

fs.writeFileSync(path.join(__dirname, 'reel-grafico.html'), html);
fs.writeFileSync(path.join(__dirname, 'reel-grafico.meta.json'), JSON.stringify({ totalMs: TOTAL_MS }));
console.log('wrote reel-grafico.html, total', TOTAL_MS, 'ms');
