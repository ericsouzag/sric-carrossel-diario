const fs = require('fs');
const path = require('path');
const { buildEmbeddableCarousel } = require('./gen-carousel.js');
const { aplicacaoRealSlides } = require('./aplicacao-real.js');

const legenda = `Lá no primeiro post dessa série eu te mostrei que toda vez que algo sobe e desce, tem uma parábola por trás. Hoje a gente resolve o problema de verdade.

Uma bola é lançada do chão a 20 m/s. A altura dela, em metros, depois de t segundos, é h(t) = −5t² + 20t.

Aplicando exatamente o que vimos nos últimos dias: Δ = 400, a bola toca o chão em t = 0 e t = 4, fica 4 segundos no ar. O vértice fica em (2, 20): aos 2 segundos, ela atinge 20 metros de altura.

Identificar, achar Δ, achar raízes, achar vértice, desenhar o gráfico. O mesmo caminho resolve qualquer problema desse tipo.

Salva essa série inteira pra quando precisar revisar.

#funcaodosegundograu #matematicabasica #bhaskara #aplicacaomatematica #professoreric`;

const carouselHtml = buildEmbeddableCarousel({
  id: 'd6',
  slides: aplicacaoRealSlides,
  caption: legenda.replace(/#\w+/g, m => `<span style="color:#5AB0F5;">${m}</span>`),
});

const template = fs.readFileSync(path.join(__dirname, 'reels', 'preview-dia6.html'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'reels', 'preview-dia6.html'), template.replace('__CAROUSEL__', carouselHtml));
console.log('wrote reels/preview-dia6.html');
