const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, formulaSlide, calcSlide, realGraphSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const bhaskaraXSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Fórmula de Bhaskara', headline: 'Com o Δ calculado, a fórmula de Bhaskara te dá os valores de x.', highlight: 'os valores de x' }),
  (i, t) => formulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'A fórmula completa', headline: 'O ± quer dizer que uma equação do 2º grau pode ter até dois valores de x.', formulaLabel: 'fórmula de Bhaskara', formula: 'x = (−b ± √Δ) / 2a' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'dark', kicker: 'Voltando ao exemplo', headline: 'x² − 5x + 6 = 0 (Δ = 1, do post de ontem)', rows: [
    { value: 'x = (−b ± √Δ) / 2a', note: 'fórmula de Bhaskara' },
    { value: 'x = (5 ± √1) / 2', note: 'substituindo −b = 5, Δ = 1, 2a = 2' },
    { value: 'x = (5 ± 1) / 2', note: 'raiz quadrada de 1 é 1' },
  ], footer: "x' = 3 e x'' = 2." }),
  (i, t) => realGraphSlide({ index: i, total: t, bg: 'dark', kicker: 'Prova no gráfico', headline: 'Os dois valores de x são exatamente onde a parábola cruza o eixo X.', formulaHtml: "x' = 3 &nbsp;&nbsp; x'' = 2",
    a: 1, b: -5, c: 6, xmin: 0, xmax: 4.5,
    mark: [
      { x: 2.5, y: -0.25 },
      { x: 2, y: 0, big: true, label: "x'' = 2", labelDx: -56, labelDy: 20 },
      { x: 3, y: 0, big: true, label: "x' = 3", labelDx: 10, labelDy: 20 },
    ],
    note: 'Mesma equação dos últimos dois posts. Bhaskara não inventa pontos novos — só calcula por fora o que o gráfico já mostra.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Você já achou o Δ de x² + 2x + 1 = 0. Agora aplica Bhaskara e acha o valor de x.', body: 'Comenta sua resposta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t }),
];

fs.writeFileSync(path.join(__dirname, 'bhaskara-x.html'), buildCarouselPage({ title: 'Bhaskara: como achar os valores de x', slides: bhaskaraXSlides }));
console.log('wrote bhaskara-x.html');

module.exports = { bhaskaraXSlides };
