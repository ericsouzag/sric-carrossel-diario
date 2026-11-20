const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, shapeFormulaSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const perimetroSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria — Dia 2', headline: 'Perímetro é só uma coisa: somar todos os lados.', highlight: 'somar todos os lados' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O que é', headline: 'Perímetro é a distância da volta completa na figura.', body: 'Serve pra saber quanto de cerca, muro ou fita precisa pra contornar um terreno, uma quadra, qualquer forma fechada.' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Quadrado', headline: 'Os 4 lados são iguais, então basta multiplicar por 4.', shape: 'square', shapeOpts: { side: '6 m' }, formulaLabel: 'fórmula', formula: 'P = 4 × lado', resultLabel: 'exemplo (lado = 6 m)', resultValue: '4 × 6 = 24 m' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Retângulo', headline: 'Lados opostos são iguais: soma base e altura, multiplica por 2.', shape: 'rect', shapeOpts: { base: '8 m', height: '3 m' }, formulaLabel: 'fórmula', formula: 'P = 2 × (base + altura)', resultLabel: 'exemplo (8 m × 3 m)', resultValue: '2 × (8 + 3) = 22 m' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'gradient', kicker: 'Qualquer polígono regular', headline: 'Todo lado igual? Multiplica o lado pela quantidade de lados.', shape: 'pentagon', shapeOpts: { side: '4 m' }, formulaLabel: 'fórmula', formula: 'P = n × lado', resultLabel: 'exemplo (pentágono, lado 4 m)', resultValue: '5 × 4 = 20 m' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'Círculo é diferente', headline: 'O círculo não tem lados retos — "somar os lados" não funciona nele.', body: 'O contorno dele é uma curva contínua, sem quebras. Por isso esse perímetro tem nome próprio: circunferência.' }),
  (i, t) => shapeFormulaSlide({ index: i, total: t, bg: 'dark', kicker: 'Circunferência', headline: 'Depende do raio e de uma constante especial: π (pi).', shape: 'circle', shapeOpts: { r: '5 m' }, formulaLabel: 'fórmula', formula: 'C = 2 × π × r', resultLabel: 'exemplo (r = 5 m, π ≈ 3,14)', resultValue: '2 × 3,14 × 5 = 31,4 m', note: 'π é sempre o mesmo número (≈3,14) — a razão entre a volta de qualquer círculo e o seu diâmetro.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'E se os lados forem diferentes?', headline: 'Aí não tem fórmula mágica: soma cada lado, um por um.', body: 'Isso vale pra qualquer forma, regular ou não. Perímetro é sempre a soma de tudo que forma o contorno.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Um terreno retangular de 15 m por 4 m: quanto de cerca você precisa pro perímetro todo?', body: 'Resolve e comenta sua resposta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Amanhã: área — o que cabe dentro da figura.' }),
];

fs.writeFileSync(path.join(__dirname, 'perimetro.html'), buildCarouselPage({ title: 'Perímetro: a volta completa na figura', slides: perimetroSlides }));
console.log('wrote perimetro.html');

module.exports = { perimetroSlides };
