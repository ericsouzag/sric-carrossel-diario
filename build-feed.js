const fs = require('fs');
const path = require('path');
const { buildEmbeddableCarousel } = require('./gen-carousel.js');
const { elementosSlides } = require('./elementos.js');
const { deltaVerticeSlides } = require('./delta-vertice.js');
const { bhaskaraXSlides } = require('./bhaskara-x.js');

const legendaBola = `Uma bola lançada pra cima sobe, atinge um ponto mais alto e desce. Esse desenho que ela faz no ar tem nome: parábola. É a curva de qualquer função do 2º grau.

Não é só física de bola. A mesma curva aparece quando uma empresa calcula o preço ideal pra ter o maior lucro possível, ou quando um engenheiro desenha o arco de uma ponte. Sempre que existe um "ponto ótimo", o máximo ou o mínimo de alguma coisa, tem uma parábola por trás.

Essa semana eu vou abrir essa função parte por parte: o que cada letra da equação significa, o que ela revela sobre o gráfico, e como desenhar esse gráfico do zero.

Salva esse post e me segue pra acompanhar a série.

#funcaodosegundograu #matematicabasica #parabola #ensinomedio #professoreric`;

const legendaElementos = `Toda equação do 2º grau se escreve assim: ax² + bx + c = 0. Três letrinhas, três papéis diferentes.

a multiplica o x² e decide a abertura da parábola: positivo abre pra cima, negativo abre pra baixo.
b multiplica o x e ajuda a deslocar a curva pros lados.
c é o número sozinho, é ele quem aparece quando x vale zero, no ponto onde a parábola corta o eixo Y.

Guarda esses três papéis. Amanhã eu mostro o que o Δ e o vértice revelam sobre esse mesmo gráfico.

Salva esse post.

#funcaodosegundograu #matematicabasica #equacaodosegundograu #ensinomedio #professoreric`;

const legendaDelta = `Com a, b e c identificados, sobram duas contas que revelam o resto do gráfico.

Δ = b² − 4ac diz quantas vezes a parábola toca o eixo X: duas vezes, uma vez, ou nenhuma. E o vértice, o ponto mais alto ou mais baixo da curva, sai direto de Xv = −b/2a e Yv = −Δ/4a.

Resolvi um exemplo completo no post: x² − 5x + 6 = 0.

Agora é sua vez: qual é o Δ de x² + 2x + 1 = 0, e quantas raízes ele tem? Comenta sua resposta aqui embaixo.

#funcaodosegundograu #matematicabasica #vertice #discriminante #professoreric`;

const legendaBhaskaraX = `Ontem você achou o Δ de x² + 2x + 1 = 0. Hoje a gente fecha essa conta.

A fórmula de Bhaskara usa esse Δ pra achar os valores de x: x = (−b ± √Δ) / 2a. O ± é o motivo de uma equação do 2º grau poder ter até duas respostas diferentes.

Resolvendo x² − 5x + 6 = 0 (o mesmo exemplo dos últimos dias): x = (5 ± 1) / 2, que dá x' = 3 e x'' = 2, exatamente os pontos onde a parábola cruza o eixo X.

Agora fecha o que começou ontem: aplica Bhaskara em x² + 2x + 1 = 0 e descobre o valor de x. Comenta aqui embaixo.

#funcaodosegundograu #matematicabasica #formuladebhaskara #bhaskara #professoreric`;

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Preview — Sequência Função 2º Grau</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Archivo:wght@700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root{ --text:#F5F5F5; --sub:#A8A8A8; --link:#5AB0F5; }
  *{box-sizing:border-box;}
  body{ margin:0; min-height:100vh; background:#1c1c1c; display:flex; flex-direction:column; align-items:center; gap:22px; padding:28px 0 60px; font-family:'Public Sans',system-ui,sans-serif; }
  .day-label{ color:#8a8a8a; font-size:12px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; width:420px; padding:0 2px; }
  .video-card{ width:420px; background:#000; color:var(--text); border-radius:14px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.18); }
  .video-card .ig-header{ display:flex; align-items:center; gap:10px; padding:12px 14px; }
  video{ width:100%; display:block; background:#000; max-height:70vh; }
  .video-card .caption{ padding:10px 14px 18px; font-size:13.5px; line-height:1.5; white-space:pre-wrap; }
  .hashtags{ color:var(--link); }
  .hint{ color:#666; font-size:11px; width:420px; text-align:center; }
</style>
</head>
<body>

<div class="day-label">Dia 1 — aprovado (ainda não publicado)</div>
<div class="video-card">
  <div class="ig-header"><b>professor.eric</b></div>
  <video src="/_blob/deef673e444aca999f66ef2a1447d43c" autoplay loop muted playsinline controls></video>
  <div class="caption"><b>professor.eric</b> ${legendaBola.replace(/#\w+/g, m => `<span class="hashtags">${m}</span>`)}</div>
</div>

<div class="day-label">Dia 2 — aprovado (ainda não publicado)</div>
${buildEmbeddableCarousel({ id: 'd2', slides: elementosSlides, caption: legendaElementos.replace(/#\w+/g, m => `<span style="color:#5AB0F5;">${m}</span>`) })}
<div class="hint">toque na metade direita/esquerda do slide pra avançar/voltar</div>

<div class="day-label">Dia 3 — aprovado (ainda não publicado)</div>
${buildEmbeddableCarousel({ id: 'd3', slides: deltaVerticeSlides, caption: legendaDelta.replace(/#\w+/g, m => `<span style="color:#5AB0F5;">${m}</span>`) })}
<div class="hint">toque na metade direita/esquerda do slide pra avançar/voltar</div>

<div class="day-label">Dia 4 — aguardando aprovação</div>
${buildEmbeddableCarousel({ id: 'd4', slides: bhaskaraXSlides, caption: legendaBhaskaraX.replace(/#\w+/g, m => `<span style="color:#5AB0F5;">${m}</span>`) })}
<div class="hint">toque na metade direita/esquerda do slide pra avançar/voltar</div>

</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'reels', 'preview-feed.html'), html);
console.log('wrote reels/preview-feed.html');
