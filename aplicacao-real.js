const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, calcSlide, realGraphSlide, vertexFormulaSlide, frac, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

// Problema: bola lançada do chão a 20 m/s. h(t) = -5t² + 20t
// Conferido com: node .claude/skills/math-content-check/scripts/quadratic.js -5 20 0
// => a=-5, b=20, c=0, Δ=400, raízes 0 e 4, vértice (2, 20)

const aplicacaoRealSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Aplicação real', headline: 'Uma bola é lançada do chão a 20 m/s. Quanto tempo ela fica no ar, e até onde ela sobe?', highlight: 'Quanto tempo ela fica no ar' }),

  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'Traduzindo pra matemática', headline: 'h(t) = −5t² + 20t', body: 'h é a altura em metros, t é o tempo em segundos. Aqui: a = −5, b = 20, c = 0. Como a é negativo, a parábola abre pra baixo — essa curva tem um ponto de altura MÁXIMA, não mínima.' }),

  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Quanto tempo no ar?', headline: 'A bola está no chão quando h(t) = 0 — são as raízes da equação.', rows: [
    { value: 'Δ = 20² − 4·(−5)·0', note: 'substituindo a = −5, b = 20, c = 0' },
    { value: 'Δ = 400', note: 'discriminante' },
    { value: `t = ${frac('−20 ± 20', '−10')}`, note: 'aplicando Bhaskara' },
    { value: 't = 0 e t = 4', note: 'sai e volta ao chão', highlight: true },
  ], footer: 'A bola fica 4 segundos no ar.' }),

  (i, t) => vertexFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Até onde ela sobe?', headline: 'A altura máxima é exatamente o vértice da parábola.', rows: [
    { value: `Xv = ${frac('−20', '−10')} = 2`, note: 'tempo (em segundos) da altura máxima' },
    { value: `Yv = ${frac('−400', '−20')} = 20`, note: 'altura máxima, em metros', highlight: true },
  ], footer: 'Em 2 segundos, a bola atinge 20 metros de altura.' }),

  (i, t) => realGraphSlide({ index: i, total: t, bg: 'dark', kicker: 'O gráfico do problema', headline: 'A mesma curva do Dia 1 — agora com números reais.', formulaHtml: 'h(t) = −5t² + 20t',
    a: -5, b: 20, c: 0, xmin: -0.3, xmax: 4.3,
    mark: [
      { x: 0, y: 0, label: 't=0' },
      { x: 4, y: 0, label: 't=4' },
      { x: 2, y: 20, big: true, label: '(2, 20)', labelDx: -46, labelDy: -18 },
    ],
    note: 'A bola sobe até o vértice (2, 20) e desce, tocando o chão de novo em t = 4.' }),

  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Resumo', headline: 'A bola fica 4 segundos no ar e atinge 20 metros de altura máxima aos 2 segundos.', body: 'O mesmo caminho do post de abertura desta série: identificar a, b, c, olhar a concavidade, achar raízes e vértice, desenhar o gráfico. Só que agora resolvendo um problema de verdade.' }),

  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Salva essa série inteira pra revisar quando precisar' }),
];

fs.writeFileSync(path.join(__dirname, 'aplicacao-real.html'), buildCarouselPage({ title: 'Função do 2º grau na prática: a bola lançada', slides: aplicacaoRealSlides }));
console.log('wrote aplicacao-real.html');

module.exports = { aplicacaoRealSlides };
