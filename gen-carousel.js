const fs = require('fs');
const path = require('path');

// ---------- Σric brand tokens, reused verbatim from the Identidade Σric brand book ----------
const T = {
  PRIMARY: '#306898',   // Azul Óculos
  LIGHT: '#577C8D',     // Azul Neblina
  DARK: '#1F2937',      // Grafite Azulado
  YELLOW: '#FACC15',    // Amarelo Σigma
  YELLOW_TINT: '#FFCE3D',
  LIGHT_BG: '#F7F4EB',  // Paper
  LIGHT_BORDER: 'rgba(31,41,55,0.14)',
  DARK_BG: '#14171B',   // Quadro-Negro
  DARK_BORDER: 'rgba(241,239,230,0.14)',
  CHALK: '#F1EFE6',
};
const GRADIENT = `linear-gradient(165deg, ${T.DARK} 0%, ${T.PRIMARY} 55%, ${T.LIGHT} 100%)`;
const FONT_HEAD = "'Archivo', Georgia, serif";
const FONT_BODY = "'Public Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";

const HANDLE = '@professor.eric';
const BRAND_NAME = 'Professor Σric';
const TAGLINE = 'Fazendo as ciências exatas parecerem fáceis.';
const ICON_B64 = fs.readFileSync(path.join(__dirname, 'icon-b64.txt'), 'utf8').trim();
const ICON_SRC = `data:image/png;base64,${ICON_B64}`;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// Σ replaces the "E" of ERIC and sits glued to "RIC" — never a separate badge.
// The glasses icon is a distinct element beside the wordmark, exactly like the site header.
function logoLockup({ size = 'sm', onDark = false } = {}) {
  const iconW = size === 'lg' ? 58 : 34;
  const wordSize = size === 'lg' ? 26 : 16;
  const ricColor = onDark || size === 'lg' ? T.CHALK : T.DARK;
  return `
  <div style="display:flex;align-items:center;gap:${size === 'lg' ? 14 : 10}px;">
    <img src="${ICON_SRC}" alt="" style="flex:none;width:${iconW}px;height:auto;display:block;">
    <span style="font-family:${FONT_HEAD};font-weight:900;font-size:${wordSize}px;letter-spacing:-0.01em;line-height:1;white-space:nowrap;"><span style="color:${T.YELLOW};">Σ</span><span style="color:${ricColor};">RIC</span></span>
  </div>`;
}

function tag(text, variant) {
  // variant: 'light' | 'dark' | 'gradient'
  const color = variant === 'light' ? T.PRIMARY : variant === 'dark' ? T.YELLOW_TINT : 'rgba(255,255,255,0.75)';
  return `<span style="display:inline-block;font-family:${FONT_MONO};font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${color};margin-bottom:18px;">${esc(text)}</span>`;
}

function progressBar(index, total, bg) {
  const pct = ((index + 1) / total) * 100;
  const light = bg === 'light';
  const trackColor = light ? 'rgba(31,41,55,0.1)' : 'rgba(241,239,230,0.14)';
  const fillColor = light ? T.PRIMARY : T.YELLOW;
  const labelColor = light ? 'rgba(31,41,55,0.4)' : 'rgba(241,239,230,0.45)';
  return `<div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
    <div style="flex:1;height:3px;background:${trackColor};border-radius:2px;overflow:hidden;">
      <div style="height:100%;width:${pct}%;background:${fillColor};border-radius:2px;"></div>
    </div>
    <span style="font-family:${FONT_MONO};font-size:11px;color:${labelColor};font-weight:500;">${index + 1}/${total}</span>
  </div>`;
}

function swipeArrow(bg) {
  const light = bg === 'light';
  const bgCol = light ? 'rgba(31,41,55,0.055)' : 'rgba(241,239,230,0.08)';
  const stroke = light ? 'rgba(31,41,55,0.28)' : 'rgba(241,239,230,0.4)';
  return `<div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,${bgCol});">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>`;
}

function slideShell({ index, total, bg, content, last = false }) {
  const bgColor = bg === 'light' ? T.LIGHT_BG : bg === 'dark' ? T.DARK_BG : null;
  const bgStyle = bgColor ? `background:${bgColor};` : `background:${GRADIENT};`;
  const textureColor = bg === 'light' ? 'rgba(31,41,55,0.045)' : 'rgba(241,239,230,0.05)';
  const texture = bg === 'gradient' ? '' : `background-image:linear-gradient(${textureColor} 1px,transparent 1px),linear-gradient(90deg,${textureColor} 1px,transparent 1px);background-size:26px 26px;`;
  return `
  <div class="slide" style="position:relative;flex:none;width:420px;height:525px;overflow:hidden;${bgStyle}${texture}font-family:${FONT_BODY};">
    ${content}
    ${!last ? swipeArrow(bg === 'light' ? 'light' : 'dark') : ''}
    ${progressBar(index, total, bg === 'light' ? 'light' : 'dark')}
  </div>`;
}

// ---------- slide content builders ----------

function heroSlide({ index, total, kicker, headline, highlight }) {
  const hl = highlight ? headline.replace(highlight, `<span style="background:${T.YELLOW};padding:0 6px;border-radius:2px;">${highlight}</span>`) : headline;
  return slideShell({
    index, total, bg: 'light',
    content: `
    <div style="position:absolute;top:28px;left:28px;">${logoLockup({ size: 'sm' })}</div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;">
      ${tag(kicker, 'light')}
      <h1 style="margin:0;font-family:${FONT_HEAD};font-weight:900;font-size:30px;line-height:1.18;letter-spacing:-0.01em;color:${T.DARK};">${hl}</h1>
    </div>`,
  });
}

function textSlide({ index, total, bg, kicker, headline, body }) {
  const headColor = bg === 'dark' ? '#fff' : bg === 'gradient' ? '#fff' : T.DARK;
  const bodyColor = bg === 'dark' ? 'rgba(241,239,230,0.78)' : bg === 'gradient' ? 'rgba(255,255,255,0.85)' : 'rgba(31,41,55,0.75)';
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:18px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:25px;line-height:1.22;letter-spacing:-0.01em;color:${headColor};">${headline}</h2>
      ${body ? `<p style="margin:0;font-size:15px;line-height:1.55;color:${bodyColor};max-width:30ch;">${body}</p>` : ''}
    </div>`,
  });
}

function formulaSlide({ index, total, bg, kicker, headline, formula, formulaLabel }) {
  const headColor = '#fff';
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:22px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:24px;line-height:1.24;letter-spacing:-0.01em;color:${headColor};">${headline}</h2>
      <div style="padding:20px 22px;background:rgba(0,0,0,0.18);border-radius:12px;border:1px solid rgba(255,255,255,0.14);">
        <p style="margin:0 0 8px;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.55);">${formulaLabel}</p>
        <p style="margin:0;font-family:${FONT_MONO};font-size:22px;font-weight:600;color:${T.YELLOW_TINT};">${formula}</p>
      </div>
    </div>`,
  });
}

function stepsSlide({ index, total, bg, kicker, headline, steps, footer }) {
  const headColor = T.DARK;
  const rows = steps.map((s, i) => `
    <div style="display:flex;align-items:baseline;gap:16px;padding:13px 0;border-bottom:1px solid ${T.LIGHT_BORDER};">
      <span style="font-family:${FONT_MONO};font-size:19px;font-weight:600;color:${T.PRIMARY};min-width:26px;">${String(i + 1).padStart(2, '0')}</span>
      <div>
        <div style="font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${T.DARK};">${s.label}</div>
        <div style="font-family:${FONT_MONO};font-size:13px;color:rgba(31,41,55,0.55);margin-top:1px;">${s.value}</div>
      </div>
    </div>`).join('');
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:14px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0 0 4px;font-family:${FONT_HEAD};font-weight:800;font-size:22px;line-height:1.22;color:${headColor};">${headline}</h2>
      <div>${rows}</div>
      ${footer ? `<p style="margin:10px 0 0;font-family:${FONT_HEAD};font-weight:800;font-size:15px;color:${T.PRIMARY};">${footer}</p>` : ''}
    </div>`,
  });
}

function calcLadder(rows) {
  return rows.map((r, i) => {
    const pad = i === 0 ? '0 0 12px' : '12px 0';
    const borderTop = i > 0 ? `border-top:1px solid rgba(255,255,255,0.14);` : '';
    const opSpan = `<span style="font-family:${FONT_MONO};font-size:19px;font-weight:700;color:${r.highlight ? T.YELLOW_TINT : 'rgba(255,255,255,0.55)'};min-width:30px;flex-shrink:0;white-space:nowrap;">${r.op || ''}</span>`;
    const valueSpan = `<span style="font-family:${FONT_MONO};font-size:${r.highlight ? 23 : 19}px;font-weight:${r.highlight ? 800 : 600};color:${r.highlight ? T.YELLOW_TINT : '#fff'};flex-shrink:0;white-space:nowrap;">${r.value}</span>`;
    // noteBelow: nota embaixo do cálculo em vez de ao lado -- evita a nota espremer numa coluna estreita e quebrar linha a linha quando op+value já ocupam a largura toda.
    if (r.noteBelow) {
      return `<div style="padding:${pad};${borderTop}">
        <div style="display:flex;align-items:baseline;gap:14px;">${opSpan}${valueSpan}</div>
        ${r.note ? `<div style="font-family:${FONT_BODY};font-size:12.5px;line-height:1.35;color:rgba(255,255,255,0.6);margin-top:6px;">${r.note}</div>` : ''}
      </div>`;
    }
    const noteSpan = `<span style="font-family:${FONT_BODY};font-size:12.5px;line-height:1.35;color:rgba(255,255,255,0.6);flex:1;min-width:0;">${r.note || ''}</span>`;
    return `<div style="display:flex;align-items:baseline;gap:14px;padding:${pad};${borderTop}">${opSpan}${valueSpan}${noteSpan}</div>`;
  }).join('');
}

// fração com numerador em cima e denominador embaixo (nunca usar a barra "/")
function frac(num, den) {
  return `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 5px;line-height:1.2;">
    <span style="padding:0 2px;">${num}</span>
    <span style="border-top:2px solid currentColor;padding:1px 2px 0;">${den}</span>
  </span>`;
}

function vertexFormulaSlide({ index, total, bg, kicker, headline, rows, footer }) {
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 50px;gap:14px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:20px;line-height:1.22;color:#fff;">${headline}</h2>
      <div style="display:flex;gap:30px;font-family:${FONT_MONO};font-size:20px;font-weight:700;color:#fff;align-items:center;">
        <span>Xv = ${frac('−b', '2a')}</span>
        <span>Yv = ${frac('−Δ', '4a')}</span>
      </div>
      <div style="padding:16px 20px;background:rgba(0,0,0,0.22);border-radius:12px;border:1px solid rgba(255,255,255,0.14);">
        ${calcLadder(rows)}
      </div>
      ${footer ? `<p style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:15px;color:${T.YELLOW_TINT};">${footer}</p>` : ''}
    </div>`,
  });
}

function calcSlide({ index, total, bg, kicker, headline, rows, footer }) {
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:16px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:21px;line-height:1.22;letter-spacing:-0.01em;color:#fff;">${headline}</h2>
      <div style="padding:18px 20px;background:rgba(0,0,0,0.22);border-radius:12px;border:1px solid rgba(255,255,255,0.14);">
        ${calcLadder(rows)}
      </div>
      ${footer ? `<p style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:16px;color:${T.YELLOW_TINT};">${footer}</p>` : ''}
    </div>`,
  });
}

function ctaSlide({ index, total, ctaText }) {
  return slideShell({
    index, total, bg: 'gradient', last: true,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:0 36px 60px;gap:24px;">
      ${logoLockup({ size: 'lg', onDark: true })}
      <p style="margin:0;font-family:${FONT_HEAD};font-weight:700;font-style:italic;font-size:18px;line-height:1.4;color:#fff;max-width:22ch;">${TAGLINE}</p>
      <div style="display:inline-flex;align-items:center;padding:12px 24px;background:${T.YELLOW};color:${T.DARK};font-family:${FONT_BODY};font-weight:700;font-size:13px;border-radius:28px;">${esc(ctaText || 'Manda a resposta nos comentários')}</div>
    </div>`,
  });
}

// ---------- equação com rótulo por termo ----------
function equationLabelsSlide({ index, total, bg, kicker, headline }) {
  const headColor = bg === 'light' ? T.DARK : '#fff';
  const row = (term, label, color) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <span style="font-family:${FONT_MONO};font-size:34px;font-weight:800;color:${color};">${term}</span>
      <span style="font-family:${FONT_BODY};font-size:12px;line-height:1.3;color:rgba(255,255,255,0.65);text-align:center;max-width:12ch;">${label}</span>
    </div>`;
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:26px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:22px;line-height:1.25;color:${headColor};">${headline}</h2>
      <div style="text-align:center;font-family:${FONT_MONO};font-size:30px;font-weight:700;color:#fff;padding:18px 0;">
        <span style="color:${T.YELLOW_TINT};">a</span>x² + <span style="color:${T.YELLOW};">b</span>x + <span style="color:#8FD4FF;">c</span> = 0
      </div>
      <div style="display:flex;justify-content:space-between;gap:12px;">
        ${row('a', 'multiplica o x²', T.YELLOW_TINT)}
        ${row('b', 'multiplica o x', T.YELLOW)}
        ${row('c', 'fica sozinho', '#8FD4FF')}
      </div>
    </div>`,
  });
}

// ---------- mini-gráficos ilustrativos ----------
function graphIcon(variant) {
  const stroke = T.YELLOW_TINT;
  const axis = 'rgba(255,255,255,0.35)';
  const dot = '#fff';
  const common = `viewBox="0 0 140 110" width="100%" height="100%"`;
  if (variant === 'up') {
    return `<svg ${common}><line x1="10" y1="70" x2="130" y2="70" stroke="${axis}" stroke-width="2"/><line x1="70" y1="100" x2="70" y2="10" stroke="${axis}" stroke-width="2"/><path d="M20,30 Q70,95 120,30" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  if (variant === 'down') {
    return `<svg ${common}><line x1="10" y1="40" x2="130" y2="40" stroke="${axis}" stroke-width="2"/><line x1="70" y1="100" x2="70" y2="10" stroke="${axis}" stroke-width="2"/><path d="M20,85 Q70,20 120,85" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  if (variant === 'delta-pos') {
    return `<svg ${common}><line x1="10" y1="70" x2="130" y2="70" stroke="${axis}" stroke-width="2"/><path d="M15,100 Q70,5 125,100" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/><circle cx="43" cy="70" r="5" fill="${dot}"/><circle cx="97" cy="70" r="5" fill="${dot}"/></svg>`;
  }
  if (variant === 'delta-zero') {
    return `<svg ${common}><line x1="10" y1="90" x2="130" y2="90" stroke="${axis}" stroke-width="2"/><path d="M20,30 Q70,135 120,30" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="90" r="5" fill="${dot}"/></svg>`;
  }
  if (variant === 'delta-neg') {
    return `<svg ${common}><line x1="10" y1="95" x2="130" y2="95" stroke="${axis}" stroke-width="2"/><path d="M20,15 Q70,70 120,15" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  if (variant === 'y-intercept') {
    return `<svg ${common}><line x1="97.5" y1="100" x2="97.5" y2="5" stroke="${axis}" stroke-width="2"/><path d="M15,15 L42.5,75 L70,95 L97.5,75 L125,15" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="97.5" cy="75" r="6" fill="${dot}"/></svg>`;
  }
  if (variant === 'vertex') {
    return `<svg ${common}><line x1="10" y1="95" x2="130" y2="95" stroke="${axis}" stroke-width="2"/><line x1="70" y1="100" x2="70" y2="10" stroke="${axis}" stroke-width="2"/><path d="M20,85 Q70,20 120,85" fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="30" r="6" fill="${dot}"/></svg>`;
  }
  return '';
}

// ---------- gráfico real, calculado a partir de a, b, c ----------
function realGraph({ a, b, c, xmin, xmax, w = 280, h = 190, mark = [] }) {
  const n = 24;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = xmin + (xmax - xmin) * i / n;
    pts.push({ x, y: a * x * x + b * x + c });
  }
  const ys = pts.map(p => p.y);
  let ymin = Math.min(...ys, ...mark.map(m => m.y));
  let ymax = Math.max(...ys, ...mark.map(m => m.y));
  const padY = (ymax - ymin) * 0.12 || 1;
  ymin -= padY; ymax += padY;
  const pad = 14;
  const sx = (x) => pad + (x - xmin) / (xmax - xmin) * (w - 2 * pad);
  const sy = (y) => h - pad - (y - ymin) / (ymax - ymin) * (h - 2 * pad);
  const pathD = 'M' + pts.map(p => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' L');
  let axes = '';
  if (ymin <= 0 && ymax >= 0) axes += `<line x1="${pad}" y1="${sy(0).toFixed(1)}" x2="${w - pad}" y2="${sy(0).toFixed(1)}" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>`;
  if (xmin <= 0 && xmax >= 0) axes += `<line x1="${sx(0).toFixed(1)}" y1="${pad}" x2="${sx(0).toFixed(1)}" y2="${h - pad}" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>`;
  const markHtml = mark.map(m => {
    const mx = sx(m.x), my = sy(m.y);
    const r = m.big ? 7 : 5;
    const fill = m.color || (m.big ? T.YELLOW : '#fff');
    const label = m.label ? `<text x="${(mx + (m.labelDx || 10)).toFixed(1)}" y="${(my + (m.labelDy || -10)).toFixed(1)}" font-family="${FONT_MONO}" font-size="13" font-weight="700" fill="${fill}">${esc(m.label)}</text>` : '';
    return `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${r}" fill="${fill}"/>${label}`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%">${axes}<path d="${pathD}" fill="none" stroke="${T.YELLOW_TINT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>${markHtml}</svg>`;
}

function realGraphSlide({ index, total, bg, kicker, headline, formulaHtml, a, b, c, xmin, xmax, mark, note }) {
  const headColor = '#fff';
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 50px;gap:12px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:21px;line-height:1.22;color:${headColor};">${headline}</h2>
      ${formulaHtml ? `<p style="margin:0;font-family:${FONT_MONO};font-size:19px;font-weight:700;color:#fff;">${formulaHtml}</p>` : ''}
      <div style="background:rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:10px;height:200px;">
        ${realGraph({ a, b, c, xmin, xmax, mark })}
      </div>
      ${note ? `<p style="margin:0;font-family:${FONT_BODY};font-size:13px;line-height:1.4;color:rgba(255,255,255,0.72);">${esc(note)}</p>` : ''}
    </div>`,
  });
}

function graphPairSlide({ index, total, bg, kicker, headline, pairs }) {
  const headColor = '#fff';
  const cards = pairs.map(p => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:10px;background:rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:14px 10px;">
      <div style="width:100%;aspect-ratio:140/110;">${graphIcon(p.icon)}</div>
      <span style="font-family:${FONT_MONO};font-size:14px;font-weight:700;color:${T.YELLOW_TINT};">${esc(p.label)}</span>
      <span style="font-family:${FONT_BODY};font-size:11.5px;line-height:1.3;color:rgba(255,255,255,0.6);text-align:center;">${esc(p.note)}</span>
    </div>`).join('');
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:18px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:22px;line-height:1.25;color:${headColor};">${headline}</h2>
      <div style="display:flex;gap:12px;">${cards}</div>
    </div>`,
  });
}

function exampleGraphSlide({ index, total, bg, kicker, headline, formulaHtml, icon, note }) {
  const headColor = bg === 'light' ? T.DARK : '#fff';
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 60px;gap:18px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:22px;line-height:1.25;color:${headColor};">${headline}</h2>
      <p style="margin:0;font-family:${FONT_MONO};font-size:24px;font-weight:700;color:#fff;">${formulaHtml}</p>
      <div style="display:flex;align-items:center;gap:16px;background:rgba(0,0,0,0.18);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:14px;">
        <div style="width:110px;flex:none;">${graphIcon(icon)}</div>
        <span style="font-family:${FONT_BODY};font-size:13.5px;line-height:1.4;color:rgba(255,255,255,0.75);">${esc(note)}</span>
      </div>
    </div>`,
  });
}

// ---------- diagramas de geometria (quadrado, retângulo, triângulo, círculo, pentágono) ----------
function shapeDiagram(type, opts = {}) {
  const stroke = T.YELLOW_TINT;
  const dim = 'rgba(255,255,255,0.85)';
  const fillColor = opts.fill ? 'rgba(250,204,21,0.3)' : 'none';
  const common = `viewBox="0 0 220 170" width="100%" height="100%"`;
  const label = (x, y, text, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT_MONO}" font-size="15" font-weight="700" fill="${dim}">${esc(text)}</text>`;
  if (type === 'square') {
    const { side } = opts;
    return `<svg ${common}>
      <rect x="50" y="25" width="120" height="120" fill="${fillColor}" stroke="${stroke}" stroke-width="5"/>
      ${label(110, 18, side)}
      ${label(192, 90, side)}
    </svg>`;
  }
  if (type === 'rect') {
    const { base, height } = opts;
    return `<svg ${common}>
      <rect x="30" y="35" width="160" height="100" fill="${fillColor}" stroke="${stroke}" stroke-width="5"/>
      ${label(110, 28, base)}
      ${label(207, 90, height)}
    </svg>`;
  }
  if (type === 'triangle') {
    const { base, height } = opts;
    return `<svg ${common}>
      <polygon points="30,145 190,145 110,25" fill="${fillColor}" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/>
      <line x1="110" y1="145" x2="110" y2="25" stroke="${dim}" stroke-width="2" stroke-dasharray="5,4"/>
      ${label(110, 163, base)}
      ${label(130, 88, height)}
    </svg>`;
  }
  if (type === 'circle') {
    const { r } = opts;
    return `<svg ${common}>
      <circle cx="110" cy="90" r="65" fill="${fillColor}" stroke="${stroke}" stroke-width="5"/>
      <line x1="110" y1="90" x2="175" y2="90" stroke="${dim}" stroke-width="2.5"/>
      <circle cx="110" cy="90" r="3" fill="${dim}"/>
      ${label(142, 83, r)}
    </svg>`;
  }
  if (type === 'pentagon') {
    const { side } = opts;
    const cx = 110, cy = 82, R = 60;
    const pts = [];
    for (let k = 0; k < 5; k++) {
      const ang = -Math.PI / 2 + k * (2 * Math.PI / 5);
      pts.push(`${(cx + R * Math.cos(ang)).toFixed(1)},${(cy + R * Math.sin(ang)).toFixed(1)}`);
    }
    return `<svg ${common}>
      <polygon points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/>
      ${label(cx, cy + R + 22, side)}
    </svg>`;
  }
  return '';
}

function shapeFormulaSlide({ index, total, bg, kicker, headline, shape, shapeOpts, formulaLabel, formula, resultLabel, resultValue, note }) {
  return slideShell({
    index, total, bg,
    content: `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 36px 50px;gap:14px;">
      ${tag(kicker, bg)}
      <h2 style="margin:0;font-family:${FONT_HEAD};font-weight:800;font-size:21px;line-height:1.22;color:#fff;">${headline}</h2>
      <div style="display:flex;gap:14px;align-items:center;">
        <div style="flex:1;background:rgba(0,0,0,0.22);border:1px solid rgba(255,255,255,0.14);border-radius:14px;padding:10px;height:150px;">
          ${shapeDiagram(shape, shapeOpts)}
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
          <p style="margin:0;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.55);">${formulaLabel}</p>
          <p style="margin:0;font-family:${FONT_MONO};font-size:20px;font-weight:700;color:${T.YELLOW_TINT};">${formula}</p>
          ${resultValue ? `<div style="margin-top:6px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.14);">
            <p style="margin:0;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.55);">${esc(resultLabel || 'exemplo')}</p>
            <p style="margin:0;font-family:${FONT_MONO};font-size:17px;font-weight:800;color:#fff;white-space:nowrap;">${resultValue}</p>
          </div>` : ''}
        </div>
      </div>
      ${note ? `<p style="margin:0;font-family:${FONT_BODY};font-size:13px;line-height:1.4;color:rgba(255,255,255,0.72);">${esc(note)}</p>` : ''}
    </div>`,
  });
}

// ---------- IG frame wrapper ----------
function buildCarouselPage({ title, slides }) {
  const total = slides.length;
  const slideHtml = slides.map((s, i) => s(i, total)).join('\n');
  const dots = slides.map((_, i) => `<span class="ig-dot" data-dot="${i}" style="width:5px;height:5px;border-radius:50%;background:${i === 0 ? T.PRIMARY : 'rgba(31,41,55,0.2)'};display:inline-block;margin:0 3px;"></span>`).join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Public+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;}
  body{margin:0;background:#EDEBE4;font-family:${FONT_BODY};display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px 0;}
  .ig-frame{width:420px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.18);}
  .ig-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #eee;}
  .ig-avatar{width:34px;height:34px;border-radius:50%;background:${T.PRIMARY};display:flex;align-items:center;justify-content:center;font-family:${FONT_HEAD};font-weight:900;color:${T.YELLOW};font-size:15px;}
  .ig-handle{font-size:13px;font-weight:600;color:#262626;}
  .ig-sub{font-size:11px;color:#8e8e8e;}
  .carousel-viewport{width:420px;height:525px;overflow:hidden;position:relative;cursor:grab;}
  .carousel-track{display:flex;height:100%;transition:transform 0.35s ease;}
  .ig-dots{display:flex;align-items:center;justify-content:center;padding:10px 0;}
  .ig-actions{display:flex;align-items:center;gap:14px;padding:10px 14px;}
  .ig-caption{padding:0 14px 14px;font-size:13px;color:#262626;}
  .ig-caption b{font-weight:600;}
</style>
</head>
<body>
<div class="ig-frame">
  <div class="ig-header">
    <div class="ig-avatar">Σ</div>
    <div>
      <div class="ig-handle">${esc(HANDLE)}</div>
      <div class="ig-sub">${esc(BRAND_NAME)}</div>
    </div>
  </div>
  <div class="carousel-viewport" id="viewport">
    <div class="carousel-track" id="track">
      ${slideHtml}
    </div>
  </div>
  <div class="ig-dots" id="dots">${dots}</div>
  <div class="ig-actions">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 19l8.8-8.6c1.6-1.6 1.6-4.2 0-5.8Z"/></svg>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-5.1A8.4 8.4 0 1 1 21 11.5Z"/></svg>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M22 3 11 14M22 3l-7 19-4-9-9-4 20-6Z"/></svg>
  </div>
  <div class="ig-caption"><b>${esc(HANDLE)}</b> ${esc(title)} · 2 HORAS ATRÁS</div>
</div>
<script>
  const track = document.getElementById('track');
  const dotsWrap = document.getElementById('dots');
  const total = ${total};
  let idx = 0;
  function render(){ track.style.transform = 'translateX(' + (-idx*420) + 'px)';
    [...dotsWrap.children].forEach((d,i)=>d.style.background = i===idx ? '${T.PRIMARY}' : 'rgba(31,41,55,0.2)'); }
  document.getElementById('viewport').addEventListener('click', (e)=>{
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left > r.width/2) idx = Math.min(idx+1, total-1); else idx = Math.max(idx-1, 0);
    render();
  });
  render();
</script>
</body>
</html>`;
}

// ---------- embeddable carousel (for combining several posts on one preview page) ----------
function buildEmbeddableCarousel({ id, slides, caption }) {
  const total = slides.length;
  const slideHtml = slides.map((s, i) => s(i, total)).join('\n');
  const dots = slides.map((_, i) => `<span class="ig-dot" style="width:5px;height:5px;border-radius:50%;background:${i === 0 ? T.PRIMARY : 'rgba(31,41,55,0.2)'};display:inline-block;margin:0 3px;"></span>`).join('');
  return `
  <div class="ig-frame" style="width:420px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.18);margin:0 auto;">
    <div class="ig-header" style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #eee;">
      <div style="width:34px;height:34px;border-radius:50%;background:${T.PRIMARY};display:flex;align-items:center;justify-content:center;font-family:${FONT_HEAD};font-weight:900;color:${T.YELLOW};font-size:15px;">Σ</div>
      <div><div style="font-size:13px;font-weight:600;color:#262626;">${esc(HANDLE)}</div><div style="font-size:11px;color:#8e8e8e;">${esc(BRAND_NAME)}</div></div>
    </div>
    <div id="viewport-${id}" style="width:420px;height:525px;overflow:hidden;position:relative;cursor:pointer;">
      <div id="track-${id}" style="display:flex;height:100%;transition:transform 0.35s ease;">
        ${slideHtml}
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:16px;padding:10px 14px;background:#fafafa;border-top:1px solid #eee;">
      <button id="prev-${id}" style="font-family:${FONT_BODY};font-size:13px;font-weight:700;color:#262626;background:#fff;border:1px solid #ddd;border-radius:20px;padding:8px 16px;cursor:pointer;">‹ Anterior</button>
      <div id="dots-${id}" style="display:flex;align-items:center;justify-content:center;">${dots}</div>
      <button id="next-${id}" style="font-family:${FONT_BODY};font-size:13px;font-weight:700;color:#fff;background:${T.PRIMARY};border:none;border-radius:20px;padding:8px 16px;cursor:pointer;">Próximo ›</button>
    </div>
    <div style="display:flex;align-items:center;gap:14px;padding:10px 14px;">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6 9 4.6c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 19l8.8-8.6c1.6-1.6 1.6-4.2 0-5.8Z"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-5.1A8.4 8.4 0 1 1 21 11.5Z"/></svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.8"><path d="M22 3 11 14M22 3l-7 19-4-9-9-4 20-6Z"/></svg>
    </div>
    <div style="padding:0 14px 14px;font-size:13px;color:#262626;white-space:pre-wrap;"><b>${esc(HANDLE)}</b> ${caption || ''}</div>
  </div>
  <script>
  (function(){
    const track = document.getElementById('track-${id}');
    const dotsWrap = document.getElementById('dots-${id}');
    const total = ${total};
    let idx = 0;
    function render(){ track.style.transform = 'translateX(' + (-idx*420) + 'px)';
      [...dotsWrap.children].forEach((d,i)=>d.style.background = i===idx ? '${T.PRIMARY}' : 'rgba(31,41,55,0.2)'); }
    function next(){ idx = Math.min(idx+1, total-1); render(); }
    function prev(){ idx = Math.max(idx-1, 0); render(); }
    document.getElementById('next-${id}').addEventListener('click', next);
    document.getElementById('prev-${id}').addEventListener('click', prev);
    document.getElementById('viewport-${id}').addEventListener('click', (e)=>{
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX - r.left > r.width/2) next(); else prev();
    });
    render();
  })();
  </script>`;
}

// ================= PILOT 1 — PORCENTAGEM =================
const porcentagemSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Matemática no dia a dia', headline: '50% de desconto + 30% de desconto NÃO é 80% de desconto.', highlight: 'NÃO é 80%' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O erro', headline: 'Isso confunde até quem compra com desconto toda semana.', body: 'Parece lógica simples: soma os dois descontos e pronto. Só que desconto não funciona assim — e essa conta errada te faz achar que tá pagando menos do que realmente tá.' }),
  (i, t) => formulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'A conta certa', headline: 'Cada desconto incide sobre o que sobrou do anterior — não sobre o preço original.', formulaLabel: 'preço original → 1º desconto → 2º desconto', formula: '100 → 50 → 35' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Resolução, passo a passo', headline: 'A conta de verdade, sem pular etapa', rows: [
    { value: 'R$ 100,00', note: 'preço original' },
    { op: '× 0,50', value: 'R$ 50,00', note: 'desconto de 50% → você paga a metade' },
    { op: '× 0,70', value: 'R$ 35,00', note: 'desconto de 30% em cima dos R$ 50 → você paga 70% disso', highlight: true },
  ], footer: 'Desconto real: 65%. Não 80%.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'dark', kicker: 'Vale pra aumento também', headline: 'Dois reajustes de 10% não são 20%. São 21%.', rows: [
    { value: 'R$ 100,00', note: 'valor original' },
    { op: '× 1,10', value: 'R$ 110,00', note: 'primeiro reajuste de 10%' },
    { op: '× 1,10', value: 'R$ 121,00', note: 'segundo reajuste de 10%, em cima do novo valor', highlight: true },
  ], footer: 'Aumento real: 21%. Cai em prova, contracheque e aluguel.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: '20% de desconto + mais 20% de desconto. Qual é o desconto total?', body: 'Não é 40%. Faz a conta e comenta sua resposta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t }),
];

// ================= PILOT 2 — BHASKARA / DELTA =================
const bhaskaraSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Matemática no dia a dia', headline: 'Bhaskara não é bicho de sete cabeças.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O problema', headline: 'O problema nunca foi a fórmula. É que ninguém te mostrou pra que ela serve antes de mandar você decorar.', body: 'Você aprende a plugar número em letra sem entender o que tá calculando — e esquece em dois meses.' }),
  (i, t) => formulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'O atalho', headline: 'Antes de resolver, o delta já te conta quantas respostas existem.', formulaLabel: 'discriminante', formula: 'Δ = b² − 4ac' }),
  (i, t) => stepsSlide({ index: i, total: t, bg: 'light', kicker: 'Os três casos', headline: 'O que o Δ te conta', steps: [
    { label: 'Δ > 0', value: 'duas raízes reais diferentes' },
    { label: 'Δ = 0', value: 'uma raiz real (dupla)' },
    { label: 'Δ < 0', value: 'nenhuma raiz real' },
  ] }),
  (i, t) => formulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Na prática', headline: 'x² − 5x + 6 = 0', formulaLabel: 'Δ = (-5)² − 4·1·6 = 25 − 24', formula: 'Δ = 1 → x = 2 e x = 3' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'x² − 4x + 4 = 0. Qual é o Δ, e quantas raízes essa equação tem?', body: 'Resolve e comenta sua resposta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t }),
];

if (require.main === module) {
  const OUT = path.join(__dirname);
  fs.writeFileSync(path.join(OUT, 'porcentagem.html'), buildCarouselPage({ title: 'Por que 50% + 30% de desconto não é 80%', slides: porcentagemSlides }));
  fs.writeFileSync(path.join(OUT, 'bhaskara.html'), buildCarouselPage({ title: 'Bhaskara sem trauma: o que o delta te conta antes de resolver', slides: bhaskaraSlides }));
  console.log('wrote porcentagem.html and bhaskara.html');
}

module.exports = {
  heroSlide, textSlide, formulaSlide, stepsSlide, calcSlide, ctaSlide, buildCarouselPage,
  equationLabelsSlide, graphPairSlide, exampleGraphSlide, buildEmbeddableCarousel,
  realGraph, realGraphSlide, frac, vertexFormulaSlide, shapeDiagram, shapeFormulaSlide,
};
