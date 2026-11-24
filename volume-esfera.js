const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, shapeFormulaSlide, calcSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const volumeEsferaSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria Espacial — Dia 4', headline: 'A esfera é a forma mais redonda que existe — e tem a fórmula mais pesada.', highlight: 'mais redonda' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Esfera', headline: 'Depende do raio ao cubo, com uma fração e um π na conta.', shape: 'sphere', shapeOpts: { r: '3 m' }, formulaLabel: 'fórmula', formula: 'V = (4 ÷ 3) × π × r³', resultLabel: 'exemplo (r = 3 m)', resultValue: 'r³ = 27' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'dark', kicker: 'Passo a passo', headline: 'A mesma conta, sem pular etapa', rows: [
    { value: '27', note: 'r³ = 3 × 3 × 3' },
    { op: '× 3,14', value: '84,78', note: 'multiplica por π (≈ 3,14)' },
    { op: '× 4 ÷ 3', value: '113,04', note: 'aplica a fração 4/3', highlight: true },
  ], footer: 'V = 113,04 m³' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Onde isso aparece', headline: 'Bola, planeta, bolha de sabão — qualquer coisa perfeitamente redonda em 3D é uma esfera.', body: 'É a forma que guarda o maior volume possível pra uma dada área de superfície — por isso bolhas e gotas tendem a ficar redondas.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Uma bola de raio 2 m. Qual o volume dela?', body: 'Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Amanhã: fechamos com uma aplicação real — a caixa d’água.' }),
];

fs.writeFileSync(path.join(__dirname, 'volume-esfera.html'), buildCarouselPage({ title: 'Volume da esfera', slides: volumeEsferaSlides }));
console.log('wrote volume-esfera.html');

module.exports = { volumeEsferaSlides };
