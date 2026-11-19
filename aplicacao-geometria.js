const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, calcSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const aplicacaoGeometriaSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria — Dia 4', headline: 'Um terreno, duas contas, dois orçamentos diferentes.', highlight: 'dois orçamentos diferentes' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O problema', headline: 'Terreno retangular de 12 m por 8 m. Precisa cercar tudo e gramar tudo.', body: 'Cercar é perímetro. Gramar é área. Cada uma com seu preço por unidade — e isso muda tudo.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Passo 1 — cercar (perímetro)', headline: 'Quanto de cerca esse terreno precisa', rows: [
    { value: '12 m e 8 m', note: 'base e altura do terreno' },
    { op: '2×(12+8)', value: '40 m', note: 'perímetro: a volta completa' },
    { op: '× R$25,00', value: 'R$ 1.000,00', note: 'preço da cerca por metro', highlight: true },
  ], footer: 'Cercar esse terreno custa R$ 1.000,00.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'dark', kicker: 'Passo 2 — gramar (área)', headline: 'Quanto de grama esse terreno precisa', rows: [
    { value: '12 m × 8 m', note: 'base vezes altura' },
    { op: '=', value: '96 m²', note: 'área: o que cabe dentro do terreno' },
    { op: '× R$18,00', value: 'R$ 1.728,00', note: 'preço do m² de grama', highlight: true },
  ], footer: 'Gramar esse terreno custa R$ 1.728,00.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Juntando tudo', headline: 'O orçamento completo do terreno', rows: [
    { value: 'R$ 1.000,00', note: 'cerca (perímetro)' },
    { op: '+', value: 'R$ 1.728,00', note: 'grama (área)' },
    { op: '=', value: 'R$ 2.728,00', note: 'orçamento total do terreno', highlight: true },
  ], footer: 'Perímetro e área, cada um com seu papel.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Terreno de 10 m × 5 m. Cerca a R$ 20,00/m e grama a R$ 15,00/m². Qual o orçamento total?', body: 'Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Essa semana: perímetro e área, na prática. Salva pra revisar.' }),
];

fs.writeFileSync(path.join(__dirname, 'aplicacao-geometria.html'), buildCarouselPage({ title: 'Orçamento de um terreno: cercar e gramar', slides: aplicacaoGeometriaSlides }));
console.log('wrote aplicacao-geometria.html');

module.exports = { aplicacaoGeometriaSlides };
