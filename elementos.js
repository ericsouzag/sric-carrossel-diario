const fs = require('fs');
const path = require('path');
const { heroSlide, textSlide, equationLabelsSlide, graphPairSlide, realGraphSlide, ctaSlide, buildCarouselPage } = require('./gen-carousel.js');

const elementosSlides = [
  (i, t) => heroSlide({ index: i, total: t, kicker: 'Função do 2º grau', headline: 'Toda equação tem 3 letrinhas que decidem tudo.', highlight: '3 letrinhas' }),
  (i, t) => equationLabelsSlide({ index: i, total: t, bg: 'dark', kicker: 'A forma geral', headline: 'Toda função do 2º grau segue esse padrão.' }),
  (i, t) => graphPairSlide({ index: i, total: t, bg: 'gradient', kicker: 'O termo a', headline: 'O sinal de a decide a abertura da parábola.', pairs: [
    { icon: 'up', label: 'a > 0', note: 'abre pra cima' },
    { icon: 'down', label: 'a < 0', note: 'abre pra baixo' },
  ] }),
  (i, t) => textSlide({ index: i, total: t, bg: 'light', kicker: 'O termo b', headline: 'b multiplica o x e ajuda a deslocar a curva pros lados.', body: 'Sozinho ele não diz muita coisa — junto com o a, define onde fica o vértice.' }),
  (i, t) => realGraphSlide({ index: i, total: t, bg: 'dark', kicker: 'O termo c', headline: 'c aparece sozinho, e marca onde a parábola corta o eixo Y.', formulaHtml: `f(x) = x² + 2x + <span style="background:#FACC15;color:#1F2937;padding:0 7px;border-radius:4px;">3</span>`,
    a: 1, b: 2, c: 3, xmin: -3.5, xmax: 1.5,
    mark: [
      { x: -1, y: 2, label: 'vértice', labelDx: -46, labelDy: 22 },
      { x: 0, y: 3, big: true, label: '(0, 3)', labelDx: 16, labelDy: -10 },
    ],
    note: 'Quando x = 0, sobram só os termos sem x: f(0) = c = 3. Por isso o gráfico corta o eixo Y exatamente em y = 3, o mesmo valor de c.' }),
  (i, t) => ctaSlide({ index: i, total: t, ctaText: 'Salva esse resumo — ele vale pros próximos posts.' }),
];

fs.writeFileSync(path.join(__dirname, 'elementos.html'), buildCarouselPage({ title: 'Os 3 elementos da equação do 2º grau', slides: elementosSlides }));
console.log('wrote elementos.html');

module.exports = { elementosSlides };
