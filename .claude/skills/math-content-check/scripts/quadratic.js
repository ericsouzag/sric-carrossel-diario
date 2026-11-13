#!/usr/bin/env node
// Calculadora determinística de função do 2º grau: f(x) = a*x^2 + b*x + c
// Uso: node quadratic.js <a> <b> <c> [xmin] [xmax]
// Imprime vértice, discriminante, raízes (se reais) e interseção com Y.
// Rode isso ANTES de escrever qualquer slide/cena que cite esses valores —
// nunca calcule "de cabeça" e cole o resultado direto no slide.

const [a, b, c] = process.argv.slice(2, 5).map(Number);
if ([a, b, c].some(Number.isNaN)) {
  console.error('Uso: node quadratic.js <a> <b> <c> [xmin] [xmax]');
  process.exit(1);
}

const delta = b * b - 4 * a * c;
const xv = -b / (2 * a);
const yv = a * xv * xv + b * xv + c;
const yIntercept = c;

let roots = null;
if (delta > 0) {
  const r1 = (-b - Math.sqrt(delta)) / (2 * a);
  const r2 = (-b + Math.sqrt(delta)) / (2 * a);
  roots = [Math.min(r1, r2), Math.max(r1, r2)];
} else if (delta === 0) {
  roots = [xv];
}

const out = {
  equacao: `f(x) = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
  a, b, c,
  delta,
  concavidade: a > 0 ? 'para cima (a > 0)' : a < 0 ? 'para baixo (a < 0)' : 'não é função do 2º grau (a = 0)',
  vertice: { x: round(xv), y: round(yv) },
  y_intercepto: { x: 0, y: yIntercept },
  raizes: roots ? roots.map(round) : [],
  quantidade_de_raizes_reais: delta > 0 ? 2 : delta === 0 ? 1 : 0,
};

// domínio sugerido pro gráfico: cobre vértice + raízes (quando existem) com margem
const xs = [xv, 0, ...(roots || [])];
let xmin = process.argv[6] !== undefined ? Number(process.argv[6]) : Math.min(...xs) - 1.5;
let xmax = process.argv[7] !== undefined ? Number(process.argv[7]) : Math.max(...xs) + 1.5;
out.dominio_sugerido_para_realGraph = { xmin: round(xmin), xmax: round(xmax) };

console.log(JSON.stringify(out, null, 2));

function round(n) { return Math.round(n * 1000) / 1000; }
