const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, shapeFormulaSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const volumeCilindroSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria Espacial — Dia 3', headline: 'A primeira forma redonda: o cilindro.', highlight: 'forma redonda' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'A lógica', headline: 'É a mesma ideia do paralelepípedo: área da base vezes altura.', body: 'Só que a base não é um retângulo — é um círculo. Por isso entra a área do círculo que você já aprendeu: π × r².' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Cilindro', headline: 'Área do círculo da base, multiplicada pela altura.', shape: 'cylinder', shapeOpts: { r: '3 m', h: '5 m' }, formulaLabel: 'fórmula', formula: 'V = π × r² × altura', resultLabel: 'exemplo (r = 3 m, h = 5 m)', resultValue: '3,14 × 3² × 5 = 141,3 m³' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Onde isso aparece', headline: 'Lata, cano, silo, caixa d’água redonda — tudo isso é um cilindro.', body: 'Sempre que a base for um círculo e as paredes forem retas, é essa fórmula que resolve.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Um cano cilíndrico com raio 0,5 m e 4 m de comprimento. Qual o volume dele?', body: 'Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Amanhã: esfera — a forma mais redonda de todas.' }),
];

fs.writeFileSync(path.join(__dirname, 'volume-cilindro.html'), buildCarouselPage({ title: 'Volume do cilindro', slides: volumeCilindroSlides }));
console.log('wrote volume-cilindro.html');

module.exports = { volumeCilindroSlides };
