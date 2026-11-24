// Geometria Espacial Dia 1 — Reel: intuicao de volume (cubo contado em cubinhos
// vs cilindro que enche com liquido, ja que cubos nao "empilham" numa forma redonda).
const fs = require('fs');
const path = require('path');

const T = { PRIMARY: '#306898', LIGHT: '#577C8D', DARK: '#1F2937', YELLOW: '#FACC15', YELLOW_TINT: '#FFCE3D', DARK_BG: '#14171B', WATER: '#5AB0F5' };
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif", FONT_BODY = "'Public Sans', system-ui, sans-serif", FONT_MONO = "'JetBrains Mono','Courier New',monospace";
const ICON_SRC = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'icon-b64.txt'), 'utf8').trim();

// --- conferencia da matematica mostrada no video ---
const LADO = 4, V_CUBO = LADO ** 3; // 64
if (V_CUBO !== 64) throw new Error('conta do cubo nao bate');

// --- linha do tempo (ms) ---
const T_INTRO = 3000, CUBE_DUR = 11000, CYL_DUR = 11000, OUTRO_DUR = 7000;
const S_CUBE = T_INTRO;
const S_CYL = S_CUBE + CUBE_DUR;
const S_OUTRO = S_CYL + CYL_DUR;
const TOTAL = S_OUTRO + OUTRO_DUR;

const scene = (start, dur, inner, cls = '') => `<div class="scene ${cls}" style="animation-delay:${start}ms;animation-duration:${dur}ms;">${inner}</div>`;

// --- contador 1..N empilhado: cada numero fica visivel só na sua fatia de tempo e
// depois se apaga nela mesma (senão, como todos usam "forwards", ficariam todos
// acesos ao mesmo tempo, um por cima do outro -- texto não tem fundo opaco). ---
function counter(max, totalMs, startDelay) {
  const slice = totalMs / max;
  let spans = '';
  for (let i = 1; i <= max; i++) {
    const delay = startDelay + (i - 1) * slice;
    // o ultimo numero fica aceso (nao apaga, nao tem proximo pra cobrir ele)
    const cls = i === max ? 'tick-final' : 'tick';
    spans += `<span class="${cls}" style="animation-delay:${delay}ms;animation-duration:${slice}ms;">${i}</span>`;
  }
  return spans;
}

const CUBE_FILL_DELAY = 800, CUBE_FILL_DUR = 7000;
const CYL_FILL_DELAY = 800, CYL_FILL_DUR = 7000;

// cubo isometrico grande (3 faces), face da frente = quadrado liso (bom pra "encher")
const cubeSvg = `
<svg viewBox="0 0 300 220" width="100%" height="100%" overflow="visible">
  <polygon points="70,40 230,40 285,5 125,5" fill="rgba(255,255,255,0.1)" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:0ms;"/>
  <polygon points="230,40 285,5 285,165 230,200" fill="rgba(0,0,0,0.22)" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:150ms;"/>
  <polygon points="70,40 230,40 230,200 70,200" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:300ms;"/>
  <rect x="70" y="40" width="160" height="160" fill="rgba(250,204,21,0.4)" style="transform-origin:70px 200px;transform:scaleY(0);animation:growfill ${CUBE_FILL_DUR}ms linear forwards;animation-delay:${CUBE_FILL_DELAY}ms;"/>
  <polygon points="70,40 230,40 230,200 70,200" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="4"/>
  <text x="150" y="214" text-anchor="middle" font-family="${FONT_MONO}" font-size="16" font-weight="700" fill="rgba(255,255,255,0.85)" class="pop" style="animation-delay:450ms;">4 m</text>
</svg>`;

// cilindro grande com clip-path = silhueta inteira (retangulo + 2 elipses), liquido cresce de baixo
const cylSvg = `
<svg viewBox="0 0 300 240" width="100%" height="100%" overflow="visible">
  <defs>
    <clipPath id="cylclip">
      <rect x="55" y="40" width="190" height="160"/>
      <ellipse cx="150" cy="40" rx="95" ry="28"/>
      <ellipse cx="150" cy="200" rx="95" ry="28"/>
    </clipPath>
  </defs>
  <ellipse cx="150" cy="40" rx="95" ry="28" fill="rgba(255,255,255,0.08)" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:0ms;"/>
  <line x1="55" y1="40" x2="55" y2="200" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:150ms;"/>
  <line x1="245" y1="40" x2="245" y2="200" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:150ms;"/>
  <path d="M55,200 A95,28 0 0 1 245,200" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="5,5" class="pop" style="animation-delay:200ms;"/>
  <rect x="55" y="40" width="190" height="160" clip-path="url(#cylclip)" fill="rgba(90,176,245,0.55)" style="transform-origin:150px 200px;transform:scaleY(0);animation:growfill ${CYL_FILL_DUR}ms linear forwards;animation-delay:${CYL_FILL_DELAY}ms;"/>
  <path d="M55,200 A95,28 0 0 0 245,200" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="4" class="pop" style="animation-delay:200ms;"/>
</svg>`;

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
@keyframes growfill{to{transform:scaleY(1);}}
.tick{opacity:0;animation-name:tickshow;animation-timing-function:linear;animation-fill-mode:forwards;}
@keyframes tickshow{0%{opacity:1}99%{opacity:1}100%{opacity:0}}
.tick-final{opacity:0;animation-name:tickfinal;animation-timing-function:steps(1);animation-fill-mode:forwards;}
@keyframes tickfinal{to{opacity:1;}}
.scene{position:absolute;left:0;right:0;opacity:0;animation-name:sc;animation-timing-function:linear;animation-fill-mode:both;}
@keyframes sc{0%{opacity:0;transform:translateY(12px)}5%{opacity:1;transform:none}93%{opacity:1;transform:none}100%{opacity:0}}
.header{position:absolute;top:170px;left:48px;right:48px;display:flex;align-items:center;justify-content:space-between;}
.tag{font-family:${FONT_MONO};font-size:13px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.65);}
.introhead{position:absolute;left:0;right:0;top:300px;text-align:center;padding:0 40px;}
.introhead .big{font-family:${FONT_HEAD};font-weight:900;font-size:34px;color:#fff;line-height:1.25;}
.introhead .big span{color:${T.YELLOW_TINT};}
.shapebox{position:absolute;top:290px;left:70px;right:70px;height:260px;}
.counter{position:relative;width:100%;height:100%;}
.counter span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:${FONT_HEAD};font-weight:900;font-size:64px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.5);}
.caption{position:absolute;top:580px;left:48px;right:48px;text-align:center;}
.caption .line{font-family:${FONT_HEAD};font-weight:800;font-size:24px;color:#fff;line-height:1.3;opacity:0;animation:up .6s forwards;}
.formula{position:absolute;top:680px;left:48px;right:48px;text-align:center;}
.formula .box{display:inline-block;padding:14px 24px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.16);border-radius:14px;font-family:${FONT_MONO};font-weight:700;font-size:24px;color:${T.YELLOW_TINT};opacity:0;animation:up .6s forwards;}
.outro{position:absolute;left:0;right:0;top:300px;text-align:center;padding:0 44px;}
.outro .final{font-family:${FONT_HEAD};font-weight:900;font-size:30px;color:#fff;line-height:1.3;}
.outro .final span{color:${T.YELLOW_TINT};}
.cta{position:absolute;bottom:48px;left:48px;right:48px;display:flex;flex-direction:column;gap:18px;}
.cta-pill{display:inline-flex;align-self:flex-start;padding:12px 22px;background:${T.YELLOW};color:${T.DARK};font-weight:700;font-size:15px;border-radius:30px;}
</style></head><body>
<div class="stage">
  <div class="header reveal" style="animation-delay:150ms;">
    <div style="display:flex;align-items:center;gap:14px;"><img src="${ICON_SRC}" alt="" style="width:44px;height:auto;"><span style="font-family:${FONT_HEAD};font-weight:900;font-size:22px;line-height:1;"><span style="color:${T.YELLOW}">Σ</span><span style="color:#fff">RIC</span></span></div>
    <span class="tag">Geometria Espacial</span>
  </div>

  ${scene(0, T_INTRO, `<div class="introhead"><div class="big">Volume é quanto cabe dentro de uma forma — <span>mas agora em 3D</span>.</div></div>`)}

  ${scene(S_CUBE, CUBE_DUR, `
    <div class="shapebox">${cubeSvg}</div>
    <div class="shapebox"><div class="counter">${counter(V_CUBO, CUBE_FILL_DUR, CUBE_FILL_DELAY)}</div></div>
    <div class="formula"><div class="box" style="animation-delay:${CUBE_FILL_DELAY + CUBE_FILL_DUR + 200}ms;">V = 4³ = 64 m³</div></div>
  `)}

  ${scene(S_CYL, CYL_DUR, `
    <div class="shapebox">${cylSvg}</div>
    <div class="caption"><div class="line" style="animation-delay:900ms;">Aqui não dá pra contar cubinho por cubinho.</div></div>
    <div class="formula"><div class="box" style="animation-delay:${CYL_FILL_DELAY + CYL_FILL_DUR + 200}ms;">V = π × r² × altura</div></div>
  `)}

  ${scene(S_OUTRO, OUTRO_DUR, `<div class="outro"><div class="final reveal" style="animation-delay:200ms;">Cada forma tem sua própria fórmula.<br><span style="font-size:20px;color:rgba(255,255,255,.8);font-family:${FONT_BODY};font-weight:600;">Essa semana: cubo, cilindro e esfera.</span></div></div>`)}

  <div class="cta reveal" style="animation-delay:${S_OUTRO + 1200}ms;"><div class="cta-pill">Segue pra não perder</div><span style="font-family:${FONT_MONO};font-size:14px;color:rgba(255,255,255,.55);">@professor.eric</span></div>
</div></body></html>`;

const outDir = __dirname;
fs.writeFileSync(path.join(outDir, 'reel-volume-intro.html'), html);
fs.writeFileSync(path.join(outDir, 'reel-volume-intro.meta.json'), JSON.stringify({ totalMs: TOTAL }));
console.log('ok, total', TOTAL, 'ms');
