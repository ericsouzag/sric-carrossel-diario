const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, shapeFormulaSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const areaSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria — Dia 3', headline: 'Área é o que cabe dentro da figura — não é a volta.', highlight: 'o que cabe dentro' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O que é', headline: 'Enquanto o perímetro mede o contorno, a área mede a superfície inteira.', body: 'É o que você usa pra comprar piso, gramado, tinta — sempre em metro quadrado (m²), nunca em metro.' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Quadrado', headline: 'Multiplica o lado por ele mesmo.', shape: 'square', shapeOpts: { side: '6 m', fill: true }, formulaLabel: 'fórmula', formula: 'A = lado²', resultLabel: 'exemplo (lado = 6 m)', resultValue: '6 × 6 = 36 m²' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Retângulo', headline: 'Multiplica base pela altura.', shape: 'rect', shapeOpts: { base: '8 m', height: '3 m', fill: true }, formulaLabel: 'fórmula', formula: 'A = base × altura', resultLabel: 'exemplo (8 m × 3 m)', resultValue: '8 × 3 = 24 m²' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Triângulo', headline: 'Base vezes altura, dividido por 2 — metade do retângulo.', shape: 'triangle', shapeOpts: { base: '6 m', height: '4 m', fill: true }, formulaLabel: 'fórmula', formula: 'A = (base × altura) ÷ 2', resultLabel: 'exemplo (base 6 m, altura 4 m)', resultValue: '(6 × 4) ÷ 2 = 12 m²' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Círculo', headline: 'Depende do raio ao quadrado, multiplicado por π.', shape: 'circle', shapeOpts: { r: '5 m', fill: true }, formulaLabel: 'fórmula', formula: 'A = π × r²', resultLabel: 'exemplo (r = 5 m, π ≈ 3,14)', resultValue: '3,14 × 5² = 78,5 m²' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Uma sala quadrada de 4 m de lado. Quantos m² de piso você precisa comprar?', body: 'E lembra dos 3 terrenos do Dia 1: mesmo perímetro não garante mesma área. São contas diferentes. Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Amanhã: um problema real juntando as duas contas.' }),
];

fs.writeFileSync(path.join(__dirname, 'area.html'), buildCarouselPage({ title: 'Área: o que cabe dentro da figura', slides: areaSlides }));
console.log('wrote area.html');

module.exports = { areaSlides };
