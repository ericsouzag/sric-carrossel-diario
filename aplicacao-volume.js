const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, calcSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const aplicacaoVolumeSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Geometria Espacial — Dia 5', headline: 'Quantos litros cabem numa caixa d’água?', highlight: 'Quantos litros' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'dark', kicker: 'O problema', headline: 'Caixa d’água cilíndrica: raio de 0,5 m e altura de 2 m. Quantos litros ela guarda?', body: 'Volume dá em metro cúbico. Litro é outra unidade. Precisa converter.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'gradient', kicker: 'Passo 1 — volume em m³', headline: 'Aplica a fórmula do cilindro', rows: [
    { value: '0,5 m e 2 m', note: 'raio e altura da caixa' },
    { op: '0,5²', value: '0,25', note: 'raio ao quadrado' },
    { op: '× 3,14 × 2', value: '1,57 m³', note: 'área da base vezes a altura', highlight: true },
  ], footer: 'A caixa tem 1,57 m³ de volume.' }),
  (i, t) => calcSlide({ index: i, total: t, bg: 'dark', kicker: 'Passo 2 — de m³ pra litro', headline: 'A conversão que fecha a conta', rows: [
    { value: '1 m³', note: 'equivale a' },
    { op: '=', value: '1.000 L', note: 'todo metro cúbico vira mil litros' },
    { op: '× 1,57', value: '1.570 L', note: 'multiplica pelo volume da caixa', highlight: true, noteBelow: true },
  ], footer: 'Essa caixa d’água guarda 1.570 litros.' }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'Agora você', headline: 'Uma caixa d’água cúbica de 1 m de lado. Quantos litros ela guarda?', body: 'Dica: primeiro ache o volume em m³, depois converte pra litro. Resolve e comenta aqui embaixo.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Essa semana: cubo, cilindro e esfera, na prática. Salva pra revisar.' }),
];

fs.writeFileSync(path.join(__dirname, 'aplicacao-volume.html'), buildCarouselPage({ title: 'Quantos litros cabem numa caixa d’água', slides: aplicacaoVolumeSlides }));
console.log('wrote aplicacao-volume.html');

module.exports = { aplicacaoVolumeSlides };
