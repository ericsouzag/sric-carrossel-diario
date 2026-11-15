// Dia 5 — Reel capstone: construção do gráfico de f(x) = x² − 4x + 3 em 6 etapas (sem áudio/legenda).
// Números calculados com: node .claude/skills/math-content-check/scripts/quadratic.js 1 -4 3
const fs = require('fs');
const path = require('path');

const T = { PRIMARY:'#306898', LIGHT:'#577C8D', DARK:'#1F2937', YELLOW:'#FACC15', YELLOW_TINT:'#FFCE3D', DARK_BG:'#14171B', ICE:'#A9D3F2' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif", FONT_BODY = "'Public Sans', system-ui, sans-serif", FONT_MONO = "'JetBrains Mono','Courier New',monospace";
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

// --- matemática (valores conferidos pela calculadora da skill) ---
const A = 1, B = -4, C = 3;
const f = (x) => A * x * x + B * x + C;
const delta = B * B - 4 * A * C;                 // 4
const r1 = (-B - Math.sqrt(delta)) / (2 * A);    // 1
const r2 = (-B + Math.sqrt(delta)) / (2 * A);    // 3
const xv = -B / (2 * A), yv = f(xv);             // 2, -1
const symX = 2 * xv - 0;                         // simétrico de x=0 em relação a x=2 -> 4
if (delta !== 4 || r1 !== 1 || r2 !== 3 || xv !== 2 || yv !== -1 || f(0) !== 3 || f(symX) !== 3) throw new Error('conta não bate');

// --- plano cartesiano ---
const U = 66, XMIN = -1.2, XMAX = 5.2, YMIN = -1.8, YMAX = 4.2;
const GW = (XMAX - XMIN) * U, GH = (YMAX - YMIN) * U; // 422 x 396
const px = (x) => +((x - XMIN) * U).toFixed(1), py = (y) => +((YMAX - y) * U).toFixed(1);
// parábola: amostra real de f entre as bordas do quadro (y = YMAX)
const xl = xv - Math.sqrt((YMAX - yv) / A), xr = xv + Math.sqrt((YMAX - yv) / A);
let d = '';
for (let i = 0; i <= 60; i++) { const x = xl + (xr - xl) * i / 60; d += (i ? 'L' : 'M') + px(x) + ' ' + py(f(x)) + ' '; }

// --- linha do tempo (ms) ---
const T_INTRO = 3000, STEP = 7500;
const S = (n) => T_INTRO + (n - 1) * STEP;   // início do passo n
const T_OUTRO = S(7), TOTAL = T_OUTRO + 6000;

const scene = (start, dur, inner, cls = '') => `<div class="scene ${cls}" style="animation-delay:${start}ms;animation-duration:${dur}ms;">${inner}</div>`;
const at = (ms, cls = 'pop') => `class="${cls}" style="animation-delay:${ms}ms;"`;

function pt(x, y, color, label, dx, dy, anchor, delay) {
  return `<g ${at(delay)} style="animation-delay:${delay}ms;transform-box:fill-box;transform-origin:center;">
    <circle cx="${px(x)}" cy="${py(y)}" r="9" fill="${color}" stroke="#14171B" stroke-width="3"/>
    <text x="${px(x) + dx}" y="${py(y) + dy}" text-anchor="${anchor}" class="plabel" fill="${color}">${label}</text></g>`;
}

const grid = [];
for (let x = Math.ceil(XMIN); x <= XMAX; x++) grid.push(`<line x1="${px(x)}" y1="0" x2="${px(x)}" y2="${GH}" class="gl"/>`);
for (let y = Math.ceil(YMIN); y <= YMAX; y++) grid.push(`<line x1="0" y1="${py(y)}" x2="${GW}" y2="${py(y)}" class="gl"/>`);

const svg = `
<svg width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}" style="overflow:visible">
  ${grid.join('')}
  <line x1="0" y1="${py(0)}" x2="${GW}" y2="${py(0)}" class="ax"/>
  <line x1="${px(0)}" y1="0" x2="${px(0)}" y2="${GH}" class="ax"/>
  <text x="${GW - 4}" y="${py(0) - 8}" text-anchor="end" class="axl">x</text>
  <text x="${px(0) + 10}" y="14" class="axl">y</text>
  <!-- eixo de simetria (passo 4) -->
  <line x1="${px(xv)}" y1="0" x2="${px(xv)}" y2="${GH}" class="sym" style="animation-delay:${S(4) + 3600}ms"/>
  <!-- ligação do par simétrico (passo 5) -->
  <line x1="${px(0)}" y1="${py(3)}" x2="${px(symX)}" y2="${py(3)}" class="sym" style="animation-delay:${S(5) + 4300}ms"/>
  <!-- parábola (passo 6) -->
  <path d="${d}" pathLength="1" class="curve" style="animation-delay:${S(6) + 1500}ms"/>
  ${pt(r1, 0, T.ICE, '(1, 0)', 0, 30, 'middle', S(3) + 4600)}
  ${pt(r2, 0, T.ICE, '(3, 0)', 0, 30, 'middle', S(3) + 5300)}
  ${pt(xv, yv, T.YELLOW, '(2, −1)', 0, 34, 'middle', S(4) + 3000)}
  ${pt(0, 3, '#FFB4A2', '(0, 3)', -14, 7, 'end', S(5) + 3000)}
  ${pt(symX, 3, '#FFB4A2', '(4, 3)', 14, 7, 'start', S(5) + 5000)}
  <!-- ícone genérico de concavidade (passo 2): "∪" — continua abrindo pra cima se esticado -->
</svg>`;

// "∪" do passo 2: parábola tracejada ilustrativa, a>0 (abre pra cima), sem pretensão de ser f(x)
const smile = `<svg class="smile" width="200" height="120" viewBox="0 0 200 120"><path d="M20 10 Q100 210 180 10" fill="none" stroke="${T.YELLOW}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 12"/><path d="M100 92 L100 44 M84 60 L100 40 L116 60" fill="none" stroke="${T.YELLOW}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const stepHead = (n, txt) => `<div class="stephead"><span class="num">${n}</span><span class="stxt">${txt}</span></div>`;
const heads = [
  'Identificar a, b e c', 'Concavidade da parábola', 'Calcular as raízes', 'Calcular o vértice', 'Intercepto Y e ponto simétrico', 'Desenhar a parábola',
];
const bottoms = [
  `<div class="big mono"><span class="chip">a = 1</span><span class="chip">b = −4</span><span class="chip">c = 3</span></div><div class="sub">o sinal vem junto com o número</div>`,
  `<div class="big">a = 1 &gt; 0</div><div class="sub">concavidade <b>pra cima</b> — a parábola abre como um ∪</div>`,
  `<div class="mono line l1" style="animation-delay:${S(3) + 600}ms">Δ = (−4)² − 4·1·3 = 4</div>
   <div class="mono line l2" style="animation-delay:${S(3) + 2200}ms">x = (4 ± 2) / 2</div>
   <div class="mono line hl" style="animation-delay:${S(3) + 3800}ms">x = 1 &nbsp;e&nbsp; x = 3</div>`,
  `<div class="mono line" style="animation-delay:${S(4) + 600}ms">xᵥ = −b / 2a = 4 / 2 = 2</div>
   <div class="mono line" style="animation-delay:${S(4) + 1800}ms">yᵥ = f(2) = 4 − 8 + 3 = −1</div>
   <div class="mono line hl" style="animation-delay:${S(4) + 3000}ms">vértice (2, −1)</div>`,
  `<div class="mono line" style="animation-delay:${S(5) + 600}ms">f(0) = c = 3 → (0, 3)</div>
   <div class="mono line" style="animation-delay:${S(5) + 1900}ms">simétrico em relação a x = 2</div>
   <div class="mono line hl" style="animation-delay:${S(5) + 4700}ms">f(4) = 3 → (4, 3)</div>`,
  `<div class="big" style="animation-delay:${S(6) + 400}ms">ligando os 5 pontos…</div>`,
];
const scenes = heads.map((h, i) => {
  const n = i + 1;
  return scene(S(n), STEP, `${stepHead(n, h)}`, 'headscene') + scene(S(n), STEP, `<div class="bottom">${bottoms[i]}</div>`, 'botscene');
}).join('');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}
html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
.stage{position:relative;width:540px;height:960px;background-image:${GRADIENT},linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px);background-size:cover,30px 30px,30px 30px;}
.reveal{opacity:0;transform:translateY(16px);animation:up .6s cubic-bezier(.2,.7,.3,1) forwards;}
.pop{opacity:0;transform:scale(.6);animation:popin .5s cubic-bezier(.3,1.4,.4,1) forwards;}
@keyframes up{to{opacity:1;transform:translateY(0);}}
@keyframes popin{to{opacity:1;transform:scale(1);}}
.scene{position:absolute;left:0;right:0;opacity:0;animation-name:sc;animation-timing-function:linear;animation-fill-mode:both;}
@keyframes sc{0%{opacity:0;transform:translateY(12px)}5%{opacity:1;transform:none}93%{opacity:1;transform:none}100%{opacity:0}}
.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between;}
.tag{font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.65);}
.eq{position:absolute;top:226px;left:48px;right:48px;text-align:center;font-family:${FONT_MONO};font-weight:700;font-size:34px;color:#fff;}
.eq .k{color:${T.YELLOW_TINT};}
.headscene{top:284px;}
.stephead{display:flex;align-items:center;gap:14px;justify-content:center;}
.num{display:inline-flex;width:34px;height:34px;border-radius:50%;background:${T.YELLOW};color:${T.DARK};font-family:${FONT_HEAD};font-weight:900;font-size:20px;align-items:center;justify-content:center;}
.stxt{font-family:${FONT_HEAD};font-weight:800;font-size:23px;color:#fff;}
.graph{position:absolute;top:340px;left:59px;width:${GW}px;height:${GH}px;}
.gl{stroke:rgba(255,255,255,.1);stroke-width:1;}
.ax{stroke:rgba(255,255,255,.75);stroke-width:2.5;}
.axl{font-family:${FONT_MONO};font-size:16px;font-weight:700;fill:rgba(255,255,255,.75);}
.plabel{font-family:${FONT_MONO};font-weight:700;font-size:17px;paint-order:stroke;stroke:#14171B;stroke-width:4px;}
.sym{stroke:${T.YELLOW};stroke-width:2;stroke-dasharray:7 7;opacity:0;animation:fadein .5s forwards;}
@keyframes fadein{to{opacity:.8}}
.curve{fill:none;stroke:${T.YELLOW};stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 4.5s ease-in-out forwards;}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.eqa{position:absolute;}
.smilebox{position:absolute;top:470px;left:0;right:0;display:flex;justify-content:center;}
.botscene{top:752px;}
.bottom{padding:0 40px;text-align:center;}
.big{font-family:${FONT_HEAD};font-weight:900;font-size:34px;color:${T.YELLOW_TINT};opacity:0;animation:up .6s forwards;animation-delay:.4s;}
.big.mono{font-family:${FONT_MONO};display:flex;gap:10px;justify-content:center;}
.chip{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:6px 14px;font-size:28px;color:#fff;}
.sub{margin-top:10px;font-size:19px;color:rgba(255,255,255,.75);line-height:1.3;opacity:0;animation:up .6s forwards;animation-delay:1.2s;}
.sub b{color:${T.YELLOW_TINT};}
.line{font-size:25px;font-weight:700;color:#fff;margin:7px 0;opacity:0;animation:up .6s forwards;}
.line.hl{color:${T.DARK};background:${T.YELLOW};display:inline-block;padding:3px 14px;border-radius:8px;}
.mono{font-family:${FONT_MONO};}
.outro{top:790px;}
.final{font-family:${FONT_HEAD};font-weight:900;font-size:34px;color:${T.YELLOW_TINT};text-align:center;padding:0 40px;line-height:1.25;}
.cta{position:absolute;bottom:48px;left:48px;right:48px;display:flex;flex-direction:column;gap:18px;}
.cta-pill{display:inline-flex;align-self:flex-start;padding:12px 22px;background:${T.YELLOW};color:${T.DARK};font-weight:700;font-size:15px;border-radius:30px;}
</style></head><body>
<div class="stage">
  <div class="header reveal" style="animation-delay:150ms;">
    <div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="width:44px;height:auto;"><span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;line-height:1;"><span style="color:${T.YELLOW}">Σ</span><span style="color:#fff">RIC</span></span></div>
    <span class="tag">Função do 2º grau</span>
  </div>
  <div class="eq reveal" style="animation-delay:500ms;">f(x) = <span class="k">x²</span> − <span class="k">4x</span> + <span class="k">3</span></div>
  ${scene(S(1) - 2300, 2300, `<div class="stephead"><span class="stxt" style="font-size:22px;color:rgba(255,255,255,.8)">Gráfico completo em 6 passos</span></div>`, 'headscene')}
  ${scenes}
  <div class="graph reveal" style="animation-delay:1100ms;">${svg}</div>
  <div class="scene" style="top:600px;animation-delay:${S(2) + 1200}ms;animation-duration:5200ms;"><div class="smilebox" style="top:0">${smile}</div></div>
  <div class="reveal final" style="position:absolute;left:0;right:0;top:756px;animation-delay:${T_OUTRO + 300}ms;">Parábola completa!<br><span style="font-size:20px;color:rgba(255,255,255,.8);font-family:${FONT_BODY};font-weight:600">raízes, vértice e intercepto Y marcados</span></div>
  <div class="cta reveal" style="animation-delay:${T_OUTRO + 1500}ms;"><div class="cta-pill">Salva pra revisar antes da prova</div><span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,.55);">@professor.eric</span></div>
</div></body></html>`;

const outDir = path.join(__dirname, '..', 'serie-funcao-2grau', 'dia-05-grafico-completo');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'reel-grafico-completo.html'), html);
fs.writeFileSync(path.join(outDir, 'reel-grafico-completo.meta.json'), JSON.stringify({ totalMs: TOTAL }));
console.log('ok, total', TOTAL, 'ms');
