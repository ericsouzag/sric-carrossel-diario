const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, calcSlide, graphPairSlide, realGraphSlide, vertexFormulaSlide, frac, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const deltaVerticeSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Função do 2º grau', headline: 'Duas contas revelam o resto do gráfico.', highlight: 'revelam o resto do gráfico' }),
  (i, t) => graphPairSlide({ index: i, total: t, bg: 'dark', kicker: 'O discriminante Δ', headline: 'Δ = b² − 4ac diz quantas vezes a parábola toca o eixo X — nesses pontos, chamados de raízes.', pairs: [
    { icon: 'delta-pos', label: 'Δ > 0', note: '2 raízes reais (2 valores de x)' },
    { icon: 'delta-zero', label: 'Δ = 0', note: '1 raiz real (valor único de x)' },
    { icon: 'delta-neg', label: 'Δ < 0', note: 'nenhuma raiz real' },
  ] }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Exemplo resolvido', headline: 'x² − 5x + 6 = 0', rows: [
    { value: 'Δ = b² − 4ac', note: 'fórmula do discriminante' },
    { value: 'Δ = (−5)² − 4·1·6', note: 'substituindo a = 1, b = −5, c = 6' },
    { value: 'Δ = 25 − 24', note: 'resolvendo os termos' },
    { value: 'Δ = 1', note: 'maior que zero: a equação tem 2 raízes', highlight: true },
  ], footer: 'x = 2 e x = 3.' }),
  (i, t) => vertexFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'O vértice', headline: 'O vértice é o ponto mais alto ou mais baixo da parábola. Duas fórmulas acham ele.', rows: [
    { value: `Xv = ${frac('8', '4')} = 2`, note: 'substituindo a = 2, b = −8 em Xv = −b/2a' },
    { value: `Yv = ${frac('−24', '8')} = −3`, note: 'substituindo Δ = 24, a = 2 em Yv = −Δ/4a', highlight: true },
  ], footer: 'Exemplo: f(x) = 2x² − 8x + 5 → vértice (2, −3).' }),
  (i, t) => realGraphSlide({ index: i, total: t, bg: 'dark', kicker: 'O mesmo exemplo', headline: 'f(x) = 2x² − 8x + 5: os valores que acabamos de calcular.', formulaHtml: 'Xv = 2 &nbsp;&nbsp; Yv = −3',
    a: 2, b: -8, c: 5, xmin: 0, xmax: 4,
    mark: [
      { x: 2, y: -3, big: true, label: '(2, −3)', labelDx: -50, labelDy: 22 },
    ],
    note: 'Mesma função do slide anterior. O ponto (2, −3) é o vértice: o lugar mais baixo dessa parábola.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Qual é o Δ de x² + 2x + 1 = 0, e quantas raízes ele tem?', body: 'Resolve e comenta sua resposta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t }),
];

fs.writeFileSync(path.join(__dirname, 'delta-vertice.html'), buildCarouselPage({ title: 'O que o Δ e o vértice revelam sobre o gráfico', slides: deltaVerticeSlides }));
console.log('wrote delta-vertice.html');

module.exports = { deltaVerticeSlides };
