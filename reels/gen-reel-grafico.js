// Dia 5 — Reel capstone: construção do gráfico de f(x) = x² − 4x + 3 em 6 etapas (sem áudio).
// Todos os números vêm de: node .claude/skills/math-content-check/scripts/quadratic.js 1 -4 3
const fs = require('fs');
const path = require('path');

const T = { PRIMARY:'#306898', LIGHT:'#577C8D', DARK:'#1F2937', YELLOW:'#FACC15', YELLOW_TINT:'#FFCE3D', DARK_BG:'#14171B' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif";
const FONT_BODY = "'Public Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

const a = 1, b = -4, c = 3;
const f = (x) => a * x * x + b * x + c;
const disc = b * b - 4 * a * c;                 // 4
const roots = [(-b - Math.sqrt(disc)) / (2 * a), (-b + Math.sqrt(disc)) / (2 * a)]; // 1, 3
const xv = -b / (2 * a), yv = f(xv);            // 2, -1
const xs = 2 * xv - 0;                          // simétrico de x=0 em relação a x=xv -> 4
if (disc !== 4 || roots[0] !== 1 || roots[1] !== 3 || xv !== 2 || yv !== -1 || f(0) !== 3 || f(xs) !== 3) throw new Error('conta nao bate com a calculadora');

// plano: x ∈ [-1,5], y ∈ [-2,4]
const X0 = -1, X1 = 5, Y0 = -2, Y1 = 4, PX = 30, PY = 20, SX = 64, SY = 56;
const X = (x) => PX + (x - X0) * SX;
const Y = (y) => PY + (Y1 - y) * SY;
const pts = [];
for (let i = 0; i <= 120; i++) { const x = X0 + (X1 - X0) * i / 120; pts.push(`${X(x).toFixed(1)},${Y(f(x)).toFixed(1)}`); }
const pathD = 'M' + pts.join(' L');

// cenas (ms)
const S = {
  intro: [0, 4200], s1: [4200, 12200], s2: [12200, 20200], s3: [20200, 30200],
  s4: [30200, 39200], s5: [39200, 48200], s6: [48200, 58500],
};
const TOTAL_MS = 58500;

let kf = '';
function scene(id, [s, e], last = false) {
  const d = e - s, fi = (500 / d * 100).toFixed(2), fo = (100 - 450 / d * 100).toFixed(2);
  kf += `@keyframes k_${id}{0%{opacity:0;transform:translateY(14px)}${fi}%{opacity:1;transform:none}${last ? '100%{opacity:1;transform:none}' : `${fo}%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}`}}\n`;
  return `class="scn" style="animation:k_${id} ${d}ms linear ${s}ms both;"`;
}
const at = (ms) => `style="animation-delay:${ms}ms;"`;
const sty = (ms, extra = '') => `style="animation-delay:${ms}ms;${extra}"`;

const pt = (x, y, label, t, lx = 12, ly = -12, anchor = 'start') => `
  <circle class="pop" cx="${X(x)}" cy="${Y(y)}" r="7.5" fill="${T.YELLOW}" stroke="#fff" stroke-width="2.5" ${at(t)}/>
  <text class="rv" x="${X(x) + lx}" y="${Y(y) + ly}" text-anchor="${anchor}" font-family="${FONT_MONO}" font-size="15" font-weight="700" fill="#fff" ${at(t + 250)}>${label}</text>`;

const grid = [];
for (let x = X0; x <= X1; x++) grid.push(`<line x1="${X(x)}" y1="${Y(Y1)}" x2="${X(x)}" y2="${Y(Y0)}" stroke="rgba(255,255,255,0.10)"/>`);
for (let y = Y0; y <= Y1; y++) grid.push(`<line x1="${X(X0)}" y1="${Y(y)}" x2="${X(X1)}" y2="${Y(y)}" stroke="rgba(255,255,255,0.10)"/>`);
const ticks = [];
for (let x = X0; x <= X1; x++) if (x !== 0) ticks.push(`<text x="${X(x)}" y="${Y(0) + 16}" text-anchor="middle" font-family="${FONT_MONO}" font-size="12" fill="rgba(255,255,255,0.5)">${x}</text>`);
for (let y = Y0; y <= Y1; y++) if (y !== 0) ticks.push(`<text x="${X(0) - 8}" y="${Y(y) + 4}" text-anchor="end" font-family="${FONT_MONO}" font-size="12" fill="rgba(255,255,255,0.5)">${y}</text>`);

const P = S; // atalhos
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}
html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
.stage{position:relative;width:540px;height:960px;background:${GRADIENT};
  background-image:${GRADIENT},linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px);
  background-size:cover,30px 30px,30px 30px;}
.reveal,.rv{opacity:0;animation:up .6s cubic-bezier(.2,.7,.3,1) forwards;}
.reveal{transform:translateY(16px);}
.pop{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.3);animation:popin .5s cubic-bezier(.3,1.4,.4,1) forwards;}
@keyframes up{to{opacity:1;transform:none;}}
@keyframes popin{to{opacity:1;transform:scale(1);}}
.scn{opacity:0;}

.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between;}
.tag{font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.65);}
.title{position:absolute;top:214px;left:48px;right:48px;margin:0;font-family:${FONT_HEAD};font-weight:900;font-size:30px;line-height:1.15;color:#fff;letter-spacing:-.01em;}
.num{display:inline-block;background:${T.YELLOW};color:${T.DARK};padding:0 10px;border-radius:6px;margin-right:12px;}
.hl{background:${T.YELLOW};color:${T.DARK};padding:0 8px;border-radius:4px;}
.graph{position:absolute;top:300px;left:48px;width:444px;height:380px;}
.calc{position:absolute;top:712px;left:48px;right:48px;padding:14px 22px;background:rgba(0,0,0,.26);border:1px solid rgba(255,255,255,.16);border-radius:18px;}
.ln{font-family:${FONT_MONO};font-size:19px;font-weight:700;color:#fff;line-height:1.55;white-space:nowrap;}
.ln small{display:block;font-family:${FONT_BODY};font-size:14.5px;font-weight:500;color:rgba(255,255,255,.62);line-height:1.3;white-space:normal;}
.y{color:${T.YELLOW_TINT};}
.big{font-family:${FONT_MONO};font-weight:800;font-size:44px;color:${T.YELLOW_TINT};text-align:center;margin:0;}
.curve{fill:none;stroke:${T.YELLOW_TINT};stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 5200ms cubic-bezier(.4,0,.3,1) ${P.s6[0] + 900}ms forwards;}
@keyframes draw{to{stroke-dashoffset:0;}}
.cta{position:absolute;bottom:48px;left:48px;right:48px;display:flex;flex-direction:column;gap:14px;}
.pill{display:inline-flex;align-self:flex-start;padding:12px 22px;background:${T.YELLOW};color:${T.DARK};font-weight:700;font-size:15px;border-radius:30px;}
</style></head>
<body><div class="stage">

<div class="header reveal" ${at(150)}>
  <div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="width:44px;height:auto;display:block;">
  <span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;line-height:1;"><span style="color:${T.YELLOW};">Σ</span><span style="color:#fff;">RIC</span></span></div>
  <span class="tag">Gráfico passo a passo</span>
</div>

<!-- cena 0: intro -->
<div ${scene('intro', P.intro)}>
  <h1 class="title" style="top:260px;font-size:34px;">Vamos construir o gráfico de</h1>
  <p class="big" style="position:absolute;top:400px;left:0;right:0;">f(x) = x² − 4x + 3</p>
  <p class="title" style="top:490px;font-size:24px;color:rgba(255,255,255,.8);font-weight:700;">em 6 etapas.</p>
</div>

<!-- plano cartesiano (aparece depois da intro) -->
<div class="graph rv" ${at(P.intro[1] - 600)}>
<svg viewBox="0 0 444 380" width="444" height="380">
  <defs><clipPath id="clip"><rect x="${X(X0)}" y="${Y(Y1)}" width="${X(X1) - X(X0)}" height="${Y(Y0) - Y(Y1)}"/></clipPath></defs>
  ${grid.join('')}
  <line x1="${X(X0)}" y1="${Y(0)}" x2="${X(X1)}" y2="${Y(0)}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
  <line x1="${X(0)}" y1="${Y(Y1)}" x2="${X(0)}" y2="${Y(Y0)}" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
  <text x="${X(X1) - 4}" y="${Y(0) - 8}" text-anchor="end" font-family="${FONT_MONO}" font-size="14" fill="rgba(255,255,255,.7)">x</text>
  <text x="${X(0) + 8}" y="${Y(Y1) + 12}" font-family="${FONT_MONO}" font-size="14" fill="rgba(255,255,255,.7)">y</text>
  ${ticks.join('')}

  <!-- etapa 2: concavidade (setas pra cima nas laterais do plano) -->
  <g class="rv" ${at(P.s2[0] + 900)}>
    <path d="M${X(-0.7)},${Y(2.2)} L${X(-0.7)},${Y(3.6)} M${X(-0.7)},${Y(3.6)} l-7,10 M${X(-0.7)},${Y(3.6)} l7,10" stroke="${T.YELLOW}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${X(4.72)},${Y(2.2)} L${X(4.72)},${Y(3.6)} M${X(4.72)},${Y(3.6)} l-7,10 M${X(4.72)},${Y(3.6)} l7,10" stroke="${T.YELLOW}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- etapa 5: eixo de simetria -->
  <line class="rv" x1="${X(xv)}" y1="${Y(Y1)}" x2="${X(xv)}" y2="${Y(Y0)}" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="6 6" ${at(P.s5[0] + 800)}/>

  <g clip-path="url(#clip)"><path class="curve" pathLength="1" d="${pathD}"/></g>

  ${pt(roots[0], 0, '(1, 0)', P.s3[0] + 5200, -6, 38, 'end')}
  ${pt(roots[1], 0, '(3, 0)', P.s3[0] + 6600, 8, 38, 'start')}
  ${pt(xv, yv, '(2, −1)', P.s4[0] + 5000, 0, 28, 'middle')}
  ${pt(0, c, '(0, 3)', P.s5[0] + 3000, 12, -10, 'start')}
  ${pt(xs, c, '(4, 3)', P.s5[0] + 5400, -12, -12, 'end')}
</svg>
</div>

<!-- etapa 1 -->
<div ${scene('s1', P.s1)}><h2 class="title"><span class="num">1</span>Identifique a, b e c</h2></div>
<div class="scn" style="animation:k_s1c ${P.s1[1] - P.s1[0]}ms linear ${P.s1[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s1[0] + 800)}>f(x) = <span class="y">1</span>x² <span class="y">− 4</span>x <span class="y">+ 3</span></div>
    <div class="ln reveal" ${at(P.s1[0] + 2200)}><span class="y">a = 1 &nbsp; b = −4 &nbsp; c = 3</span><small>os três números que definem a parábola</small></div>
  </div>
</div>

<!-- etapa 2 -->
<div ${scene('s2', P.s2)}><h2 class="title"><span class="num">2</span>Concavidade</h2></div>
<div class="scn" style="animation:k_s2c ${P.s2[1] - P.s2[0]}ms linear ${P.s2[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s2[0] + 700)}>a = 1 <span class="y">&gt; 0</span></div>
    <div class="ln reveal" ${at(P.s2[0] + 2400)}><span class="y">parábola aberta pra cima</span><small>com a positivo, o vértice vai ser o ponto mais baixo</small></div>
  </div>
</div>

<!-- etapa 3 -->
<div ${scene('s3', P.s3)}><h2 class="title"><span class="num">3</span>As raízes</h2></div>
<div class="scn" style="animation:k_s3c ${P.s3[1] - P.s3[0]}ms linear ${P.s3[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s3[0] + 600)}>Δ = (−4)² − 4·1·3 = <span class="y">4</span></div>
    <div class="ln reveal" ${at(P.s3[0] + 2200)}>x = (4 ± 2) / 2</div>
    <div class="ln reveal" ${at(P.s3[0] + 3800)}><span class="y">x = 1 &nbsp;e&nbsp; x = 3</span><small>onde a parábola cruza o eixo x</small></div>
  </div>
</div>

<!-- etapa 4 -->
<div ${scene('s4', P.s4)}><h2 class="title"><span class="num">4</span>O vértice</h2></div>
<div class="scn" style="animation:k_s4c ${P.s4[1] - P.s4[0]}ms linear ${P.s4[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s4[0] + 600)}>xv = −(−4) / (2·1) = <span class="y">2</span></div>
    <div class="ln reveal" ${at(P.s4[0] + 2400)}>yv = 2² − 4·2 + 3 = <span class="y">−1</span></div>
    <div class="ln reveal" ${at(P.s4[0] + 4200)}><span class="y">V = (2, −1)</span><small>o ponto mais baixo da parábola</small></div>
  </div>
</div>

<!-- etapa 5 -->
<div ${scene('s5', P.s5)}><h2 class="title"><span class="num">5</span>Intercepto em Y e simetria</h2></div>
<div class="scn" style="animation:k_s5c ${P.s5[1] - P.s5[0]}ms linear ${P.s5[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s5[0] + 600)}>f(0) = <span class="y">3</span> &nbsp;→&nbsp; (0, 3)</div>
    <div class="ln reveal" ${at(P.s5[0] + 3800)}>espelho em x = 2 &nbsp;→&nbsp; <span class="y">(4, 3)</span><small>mesma altura, mesma distância do eixo de simetria</small></div>
  </div>
</div>

<!-- etapa 6 -->
<div ${scene('s6', P.s6, true)}><h2 class="title"><span class="num">6</span>Trace a parábola</h2></div>
<div class="scn" style="animation:k_s6c ${P.s6[1] - P.s6[0]}ms linear ${P.s6[0]}ms both;position:absolute;top:712px;left:48px;right:48px;">
  <div class="calc" style="position:static;">
    <div class="ln reveal" ${at(P.s6[0] + 600)}>passando por <span class="y">todos os pontos</span><small>raízes, vértice, intercepto e o ponto simétrico</small></div>
  </div>
</div>

<div class="cta reveal" ${at(P.s6[0] + 7000)}>
  <div class="pill">Salva pra construir o seu</div>
  <span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,.55);">@professor.eric</span>
</div>

</div></body></html>`;

// keyframes das caixas de cálculo (mesmas janelas das cenas)
let extra = '';
for (const k of ['intro', 's1', 's2', 's3', 's4', 's5', 's6']) {
  const [s, e] = S[k]; const d = e - s, fi = (500 / d * 100).toFixed(2), fo = (100 - 450 / d * 100).toFixed(2);
  for (const nm of (k === 'intro' ? ['intro'] : [k, k + 'c'])) extra += `@keyframes k_${nm}{0%{opacity:0;transform:translateY(14px)}${fi}%{opacity:1;transform:none}${k === 's6' ? '100%{opacity:1;transform:none}' : `${fo}%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}`}}\n`;
}
let out = html.replace('</style>', extra + '</style>');
// remove restos de scaffolding da etapa 1 (caixa vazia duplicada)
fs.writeFileSync(path.join(__dirname, 'reel-grafico.html'), out);
fs.writeFileSync(path.join(__dirname, 'reel-grafico.meta.json'), JSON.stringify({ totalMs: TOTAL_MS }));
console.log('ok', TOTAL_MS);
