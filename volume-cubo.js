const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, shapeFormulaSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const volumeCuboSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria Espacial — Dia 2', headline: 'Volume é quanto cabe dentro de uma forma — em 3D.', highlight: 'em 3D' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O que é', headline: 'Enquanto a área mede uma superfície plana, o volume mede o espaço dentro de um sólido.', body: 'Sempre em unidade cúbica: metro cúbico (m³). É o que você usa pra saber quanta água, areia ou ar cabe em alguma coisa.' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Cubo', headline: 'Os 3 lados são iguais, então basta elevar ao cubo.', shape: 'cube', shapeOpts: { side: '4 m' }, formulaLabel: 'fórmula', formula: 'V = lado³', resultLabel: 'exemplo (lado = 4 m)', resultValue: '4³ = 64 m³' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Paralelepípedo', headline: 'Comprimento vezes largura vezes altura — como empilhar camadas de área.', shape: 'box', shapeOpts: { comprimento: '5 m', largura: '3 m', altura: '2 m' }, formulaLabel: 'fórmula', formula: 'V = comp. × larg. × alt.', resultLabel: 'exemplo (5 m × 3 m × 2 m)', resultValue: '5 × 3 × 2 = 30 m³' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Repara', headline: 'O cubo é só um paralelepípedo especial: os 3 lados dão iguais.', body: 'Por isso lado³ é a mesma conta que comprimento × largura × altura quando os três valem o mesmo.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Uma caixa de 6 m de comprimento, 4 m de largura e 3 m de altura. Qual o volume dela?', body: 'Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Amanhã: cilindro — a primeira forma redonda em 3D.' }),
];

fs.writeFileSync(path.join(__dirname, 'volume-cubo.html'), buildCarouselPage({ title: 'Volume do cubo e do paralelepípedo', slides: volumeCuboSlides }));
console.log('wrote volume-cubo.html');

module.exports = { volumeCuboSlides };
