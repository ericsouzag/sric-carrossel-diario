// Dia 1 da série "Geometria — área e perímetro": 3 terrenos comparados ao vivo.
// Terreno 1: 5x4 -> P=18, A=20
// Terreno 2: 6x3 -> P=18 (IGUAL ao terreno 1), A=18 (diferente)
// Terreno 3: 10x2 -> P=24 (diferente), A=20 (IGUAL ao terreno 1)
const fs = require('fs');
const path = require('path');

const T = { PRIMARY: '#306898', LIGHT: '#577C8D', DARK: '#1F2937', YELLOW: '#FACC15', YELLOW_TINT: '#FFCE3D', DARK_BG: '#14171B', ICE: '#A9D3F2' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif", FONT_BODY = "'Public Sans', system-ui, sans-serif", FONT_MONO = "'JetBrains Mono','Courier New',monospace";
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();

// --- geometria (autoverificada antes de desenhar qualquer coisa) ---
const TERRENOS = [
  { w: 5, h: 4 },
  { w: 6, h: 3 },
  { w: 10, h: 2 },
].map(t => ({ ...t, p: 2 * (t.w + t.h), a: t.w * t.h }));
const [T1, T2, T3] = TERRENOS;
if (!(T1.p === 18 && T1.a === 20)) throw new Error('conta do terreno 1 não bate');
if (!(T2.p === T1.p && T2.a === 18)) throw new Error('terreno 2 devia ter mesmo perímetro e área diferente');
if (!(T3.a === T1.a && T3.p === 24)) throw new Error('terreno 3 devia ter mesma área e perímetro diferente');

const scene = (start, dur, inner, cls = '') => `<div class="scene ${cls}" style="animation-delay:${start}ms;animation-duration:${dur}ms;">${inner}</div>`;
// "janela" de visibilidade fixa entre dois instantes (pra números que vão sendo substituídos, ex. contagem da área)
const win = (startMs, endMs, inner, extraCls = '') => `<span class="win ${extraCls}" style="animation-delay:${startMs}ms;animation-duration:${Math.max(endMs - startMs, 1)}ms;">${inner}</span>`;

// --- linha do tempo ---
const T_INTRO = 3000;
const STEP = 10500; // duração de cada cena "terreno"
const S = (n) => T_INTRO + (n - 1) * STEP; // início da cena do terreno n (1,2,3)
const RECAP = S(4);
const RECAP_DUR = 7000;
const OUTRO = RECAP + RECAP_DUR;
const TOTAL = OUTRO + 4500;

// --- dentro de cada cena de terreno: sub-timeline relativa ao início da cena ---
const SIDE_DUR = 750;     // tempo de traço de cada lado
const SIDE_GAP = 120;     // intervalo entre o fim de um lado e o início do próximo
const sideStart = (i) => i * (SIDE_DUR + SIDE_GAP);          // i=0..3 (cima,direita,baixo,esquerda)
const PERIM_END = sideStart(3) + SIDE_DUR + 300;             // fim do traço do perímetro + respiro
const AREA_START = PERIM_END + 500;
const CELL_STAGGER = 70;
const SUMMARY_DELAY_AFTER_AREA = 500;

const U = 36; // px por metro (escala comum aos 3 terrenos, pra comparação ser honesta)
const CX = 270, CY = 478; // centro fixo da área de demonstração

function terrenoSceneHTML(t, n) {
  const rw = t.w * U, rh = t.h * U;
  const rx = CX - rw / 2, ry = CY - rh / 2;
  const sides = [
    { len: t.w, x1: rx, y1: ry, x2: rx + rw, y2: ry, lx: rx + rw / 2, ly: ry - 16, anchor: 'middle' },           // cima
    { len: t.h, x1: rx + rw, y1: ry, x2: rx + rw, y2: ry + rh, lx: rx + rw + 14, ly: ry + rh / 2, anchor: 'start' }, // direita
    { len: t.w, x1: rx + rw, y1: ry + rh, x2: rx, y2: ry + rh, lx: rx + rw / 2, ly: ry + rh + 28, anchor: 'middle' }, // baixo
    { len: t.h, x1: rx, y1: ry + rh, x2: rx, y2: ry, lx: rx - 14, ly: ry + rh / 2, anchor: 'end' },               // esquerda
  ];
  const start = S(n);

  const sideLines = sides.map((s, i) => `
    <line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" pathLength="1" class="side"
      style="animation-delay:${start + sideStart(i)}ms;animation-duration:${SIDE_DUR}ms;"/>`).join('');
  const sideLabels = sides.map((s, i) => `
    <text x="${s.lx}" y="${s.ly}" text-anchor="${s.anchor}" class="slabel pop"
      style="animation-delay:${start + sideStart(i) + SIDE_DUR - 150}ms;">${s.len}m</text>`).join('');

  // grid de área: preenche linha por linha; contagem substituída a cada linha concluída
  const cells = [];
  let idx = 0;
  const rowEndTimes = [];
  for (let row = 0; row < t.h; row++) {
    for (let col = 0; col < t.w; col++) {
      const delay = start + AREA_START + idx * CELL_STAGGER;
      cells.push(`<rect x="${rx + col * U + 2}" y="${ry + row * U + 2}" width="${U - 4}" height="${U - 4}" rx="4" class="cell pop" style="animation-delay:${delay}ms;"/>`);
      idx++;
    }
    rowEndTimes.push(AREA_START + idx * CELL_STAGGER);
  }
  const areaFillEnd = rowEndTimes[rowEndTimes.length - 1];
  const countWindows = rowEndTimes.map((end, i) => {
    const nextStart = i + 1 < rowEndTimes.length ? rowEndTimes[i + 1] : areaFillEnd + SUMMARY_DELAY_AFTER_AREA;
    return win(start + end, start + nextStart, `${(i + 1) * t.w}`, 'countnum');
  }).join('');

  const summaryDelay = start + areaFillEnd + SUMMARY_DELAY_AFTER_AREA;

  return scene(start, STEP, `
    <div class="tkicker">Terreno ${n} — ${t.w}m × ${t.h}m</div>
    <svg class="demo-svg" width="540" height="620" viewBox="0 0 540 620">
      <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" class="rectbg"/>
      ${cells.join('')}
      ${sideLines}
      ${sideLabels}
      <foreignObject x="${rx}" y="${CY - 22}" width="${rw}" height="44">
        <div xmlns="http://www.w3.org/1999/xhtml" class="countbox">${countWindows}</div>
      </foreignObject>
    </svg>
    <div class="chips pop" style="top:${150 + CY + 72 + 48}px;animation-delay:${summaryDelay}ms;">
      <span class="chip">Perímetro = ${t.p}m</span>
      <span class="chip hl">Área = ${t.a}m²</span>
    </div>
  `, 'terrenoscene');
}

const terrenoScenes = TERRENOS.map((t, i) => terrenoSceneHTML(t, i + 1)).join('');

// --- recap: 3 terrenos lado a lado, destacando os pares iguais ---
const U2 = 13;
const recapCols = [90, 270, 450];
function miniRect(t, i) {
  const rw = t.w * U2, rh = t.h * U2;
  const cx = recapCols[i];
  const x = cx - rw / 2, y = 60 - rh / 2;
  const pHl = (t.p === T1.p) ? 'hl' : '';
  const aHl = (t.a === T1.a) ? 'hl' : '';
  return `
  <div class="minicol">
    <svg width="170" height="120" viewBox="0 0 170 120">
      <rect x="${x - cx + 85}" y="${y}" width="${rw}" height="${rh}" class="minirect"/>
    </svg>
    <div class="ministats">
      <span class="ministat ${pHl}">P = ${t.p}m</span>
      <span class="ministat ${aHl}">A = ${t.a}m²</span>
    </div>
  </div>`;
}

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}
html,body{margin:0;padding:0;width:540px;height:960px;overflow:hidden;background:${T.DARK_BG};font-family:${FONT_BODY};}
.stage{position:relative;width:540px;height:960px;background-image:${GRADIENT},linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:cover,30px 30px,30px 30px;}
.reveal{opacity:0;transform:translateY(16px);animation:up .6s cubic-bezier(.2,.7,.3,1) forwards;}
.pop{opacity:0;transform:scale(.6);animation:popin .5s cubic-bezier(.3,1.4,.4,1) forwards;}
@keyframes up{to{opacity:1;transform:translateY(0);}}
@keyframes popin{to{opacity:1;transform:scale(1);}}
.scene{position:absolute;inset:0;opacity:0;animation-name:sc;animation-timing-function:linear;animation-fill-mode:both;}
@keyframes sc{0%{opacity:0;transform:translateY(10px)}4%{opacity:1;transform:none}95%{opacity:1;transform:none}100%{opacity:0}}
.win{position:absolute;opacity:0;animation-name:winfade;animation-timing-function:linear;animation-fill-mode:both;}
@keyframes winfade{0%{opacity:0}12%{opacity:1}88%{opacity:1}100%{opacity:0}}

.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between;}
.tag{font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.65);}
.headline{position:absolute;top:224px;left:48px;right:48px;margin:0;text-align:center;font-family:${FONT_HEAD};font-weight:900;font-size:27px;line-height:1.25;color:#fff;}

.terrenoscene{top:0;}
.tkicker{position:absolute;top:300px;left:0;right:0;text-align:center;font-family:${FONT_MONO};font-size:15px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${T.YELLOW_TINT};}
.demo-svg{position:absolute;top:150px;left:0;}
.rectbg{fill:rgba(0,0,0,.18);stroke:none;}
.cell{fill:rgba(250,204,21,.28);stroke:rgba(250,204,21,.55);stroke-width:1.5;transform-box:fill-box;transform-origin:center;}
.side{stroke:${T.YELLOW_TINT};stroke-width:5;stroke-linecap:round;fill:none;stroke-dasharray:1;stroke-dashoffset:1;animation-name:draw;animation-timing-function:ease-out;animation-fill-mode:forwards;}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.slabel{font-family:${FONT_MONO};font-size:19px;font-weight:700;fill:#fff;paint-order:stroke;stroke:${T.DARK_BG};stroke-width:5px;}
.countbox{width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center;}
.countnum{position:absolute;left:0;right:0;text-align:center;font-family:${FONT_MONO};font-weight:800;font-size:26px;color:${T.DARK};background:${T.YELLOW};border-radius:10px;padding:4px 0;}
.chips{position:absolute;top:660px;left:0;right:0;display:flex;gap:14px;justify-content:center;}
.chip{font-family:${FONT_MONO};font-size:17px;font-weight:700;color:#fff;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:9px 18px;}
.chip.hl{color:${T.DARK};background:${T.YELLOW};border-color:transparent;}

.recap{top:0;}
.recap-title{position:absolute;top:300px;left:48px;right:48px;text-align:center;font-family:${FONT_HEAD};font-weight:900;font-size:25px;color:#fff;line-height:1.3;}
.recap-row{position:absolute;top:420px;left:0;right:0;display:flex;justify-content:space-between;padding:0 10px;}
.minicol{width:170px;display:flex;flex-direction:column;align-items:center;gap:10px;}
.minirect{fill:rgba(0,0,0,.2);stroke:${T.YELLOW_TINT};stroke-width:2.5;}
.ministats{display:flex;flex-direction:column;gap:6px;align-items:center;}
.ministat{font-family:${FONT_MONO};font-size:14px;font-weight:700;color:rgba(255,255,255,.65);background:rgba(0,0,0,.25);border-radius:8px;padding:4px 10px;}
.ministat.hl{color:${T.DARK};background:${T.YELLOW};}
.recap-note{position:absolute;top:620px;left:48px;right:48px;text-align:center;font-family:${FONT_HEAD};font-weight:800;font-size:21px;color:${T.YELLOW_TINT};line-height:1.35;}

.outro{position:absolute;left:0;right:0;top:300px;text-align:center;padding:0 48px;}
.outro-big{font-family:${FONT_HEAD};font-weight:900;font-size:30px;color:#fff;line-height:1.3;}
.cta{position:absolute;bottom:48px;left:48px;right:48px;display:flex;flex-direction:column;gap:18px;}
.cta-pill{display:inline-flex;align-self:flex-start;padding:12px 22px;background:${T.YELLOW};color:${T.DARK};font-family:${FONT_BODY};font-weight:700;font-size:15px;border-radius:30px;}
</style></head><body>
<div class="stage">
  <div class="header reveal" style="animation-delay:150ms;">
    <div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="width:44px;height:auto;"><span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;line-height:1;"><span style="color:${T.YELLOW}">Σ</span><span style="color:#fff">RIC</span></span></div>
    <span class="tag">Geometria</span>
  </div>
  <h1 class="headline reveal" style="animation-delay:500ms;">Mesma pergunta, três terrenos diferentes.</h1>

  ${terrenoScenes}

  ${scene(RECAP, RECAP_DUR, `
    <div class="recap-title">Os três terrenos, lado a lado:</div>
    <div class="recap-row">
      ${miniRect(T1, 0)}
      ${miniRect(T2, 1)}
      ${miniRect(T3, 2)}
    </div>
    <div class="recap-note pop" style="animation-delay:2200ms;">Terreno 1 e 2 têm o MESMO perímetro.<br>Terreno 1 e 3 têm a MESMA área.</div>
  `, 'recap')}

  <div class="outro reveal" style="animation-delay:${OUTRO + 300}ms;">
    <div class="outro-big">Mesma figura, área e perímetro podem contar histórias completamente diferentes.<br><span style="font-size:20px;color:rgba(255,255,255,.8);font-family:${FONT_BODY};font-weight:600;">Essa semana eu ensino a calcular os dois, pra qualquer forma.</span></div>
  </div>
  <div class="cta reveal" style="animation-delay:${OUTRO + 1700}ms;"><div class="cta-pill">Segue pra não perder</div><span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,.55);">@professor.eric</span></div>
</div>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'reel-terrenos.html'), html);
fs.writeFileSync(path.join(__dirname, 'reel-terrenos.meta.json'), JSON.stringify({ totalMs: TOTAL }));
console.log('wrote reel-terrenos.html, total', TOTAL, 'ms');
