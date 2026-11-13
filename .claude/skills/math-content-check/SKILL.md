---
name: math-content-check
description: Confere a matemática e os gráficos antes de exportar qualquer Reel ou carrossel educacional do Professor Σric. Use esta skill sempre que for gerar, editar ou revisar um slide/cena que cite uma equação, fórmula, cálculo numérico, discriminante, vértice, raiz, interseção com eixo, ou qualquer gráfico/plano cartesiano — incluindo ao chamar calcSlide, realGraphSlide, graphPairSlide, equationLabelsSlide ou qualquer novo componente de gen-carousel.js/gen-reel.js. Rode esta checagem ANTES do export (screenshot/vídeo), mesmo que o conteúdo/roteiro já tenha sido aprovado por outra skill (ig-reel, ig-carousel, ig-caption) — essas skills decidem o que dizer, esta decide se os números e desenhos estão certos. Vale tanto pra equações concretas (ex. "x² − 5x + 6 = 0") quanto pra ícones simbólicos genéricos (ex. "concavidade pra cima vs pra baixo").
---

# Checagem matemática e visual de conteúdo

Esse projeto já cometeu, numa única sequência de posts, erros reais — não de digitação, mas de matemática ou geometria mostrada errada pro público: uma parábola com concavidade invertida em relação ao sinal de `a`, um "vértice" marcado num ponto que não pertencia à curva, um ícone de "Δ < 0" cuja forma, se estendida, provaria o contrário do que o texto dizia. Em conteúdo educacional, esse tipo de erro é pior que um erro de português — ensina a coisa errada pra quem está aprendendo. Esta skill existe pra pegar isso antes do público, não depois.

A ideia central: **nunca desenhe ou escreva um valor matemático de olho.** Calcule, depois desenhe a partir do cálculo. O resto desta skill é como fazer isso de forma rápida e consistente.

## 1. Se o slide cita uma equação concreta — calcule primeiro

Toda vez que um slide/cena referenciar uma equação específica (tem `a`, `b`, `c` reais, não só o padrão genérico `ax² + bx + c`), rode a calculadora antes de escrever qualquer texto ou coordenada:

```bash
node .claude/skills/math-content-check/scripts/quadratic.js <a> <b> <c>
```

Ela devolve vértice, Δ, raízes (se existirem), interseção com Y, e um domínio sugerido pro gráfico — tudo calculado, nada estimado. Use esses números exatos no slide (no texto, na fórmula e nas coordenadas marcadas no gráfico). Se o resultado da calculadora e o que você ia escrever de memória não baterem, confie na calculadora — é exatamente esse tipo de divergência que já causou erro antes.

## 2. Gráfico de equação concreta → sempre `realGraph`/`realGraphSlide`

Quando o gráfico representa uma equação específica, ele precisa ser o gráfico real daquela função — nunca um ícone decorativo genérico fingindo ser ela. Em `skills_uteis/carrossel-diario/gen-carousel.js`, `realGraph({a, b, c, xmin, xmax, mark})` já faz isso certo: amostra ~24 pontos reais da função, desenha os eixos na posição matemática correta (só aparecem se 0 estiver dentro do intervalo visível) e aceita uma lista `mark` de pontos pra destacar. Use o domínio que a calculadora sugeriu (ou ajuste à mão se quiser enquadrar melhor, mas sempre cobrindo vértice + raízes + o que for citado no texto).

Antes de adicionar um ponto em `mark`, confirme que ele satisfaz a própria equação: `y` tem que ser igual a `a*x² + b*x + c` para aquele `x` — nunca um valor "parecido" ou arredondado à mão. Se o ponto é o vértice ou uma raiz, os valores já vêm prontos da calculadora do passo 1.

## 3. Ícone simbólico/genérico → teste do "esticar mentalmente"

Nem todo gráfico é de uma equação específica — às vezes é um ícone abstrato pra ilustrar um conceito (ex. "a > 0 abre pra cima", "Δ < 0 não toca o eixo"). Esses continuam em `graphIcon()`, e não precisam de números reais, mas precisam passar num teste mais simples: **se você esticasse essa curva pra fora dos limites do ícone, ela continuaria consistente com o que o texto afirma?**

Isso foi exatamente o que pegou o erro do "Δ < 0": um ícone mostrava uma parábola com concavidade pra baixo e vértice acima do eixo — dentro da moldura pequena do ícone parecia "não tocar o eixo", mas qualquer parábola com concavidade pra baixo *sempre* desce e cruza o eixo se você estender a curva, então aquele desenho na verdade provava "tem raízes reais", o oposto do que o slide dizia. A versão corrigida usa concavidade pra cima com o vértice inteiro acima do eixo — essa, sim, nunca cruza o eixo não importa o quanto você estenda.

Regra prática: antes de aceitar um ícone simbólico, imagine a curva continuando pra fora da moldura e pergunte se ela ainda apoia a afirmação do slide. Se a resposta mudar, o ícone está errado, mesmo que pareça certo recortado.

## 4. Layout: números curtos não podem quebrar linha

Fórmulas e resultados numéricos (ex. "Δ = 25 − 24") ficam feios e difíceis de ler se quebram no meio por causa do flexbox encolhendo a coluna errada. Em `calcLadder()` (usado por `calcSlide`), as colunas de operador e valor já têm `white-space:nowrap; flex-shrink:0`, e só a coluna de nota/explicação (que pode ser mais longa e tolera quebrar) tem `flex:1`. Ao criar um novo componente com número + explicação lado a lado, copie esse padrão: números e fórmulas curtas nunca encolhem, só o texto explicativo absorve o espaço que falta.

## 5. Destacar um valor dentro de uma fórmula precisa de selo, não só cor

Se a fórmula inteira já usa uma cor (ex. amarelo, pra ficar legível no fundo escuro), colorir também o termo que você quer destacar não muda nada visualmente — ele já era dessa cor. Para destacar de verdade, use um selo com fundo sólido e contraste (`background` + `padding` + `border-radius`, com a cor do texto invertida), como já é feito pro "+3" no slide do termo `c` em `elementos.js`. Cor sozinha só funciona como destaque quando o resto do texto ao redor é de outra cor.

## 6. Antes de exportar: confira o que o texto afirma contra o que foi calculado

Última etapa, rápida: releia a legenda/texto do slide e confira, afirmação por afirmação, contra os números que saíram do passo 1 e os pontos usados no passo 2 — quantidade de raízes, valor do vértice, valor da interseção com Y, etc. Essa é a mesma checagem que um revisor humano faria olhando o resultado final; o objetivo aqui é fazer isso você mesmo, como Claude, antes do usuário precisar fazer de novo.

## Como isso se encaixa com as outras skills

`ig-reel`, `ig-carousel` e `ig-caption` decidem o quê dizer (roteiro, gancho, legenda, hashtags) — essa skill não compete com elas, só entra depois, checando se o que elas pediram pra desenhar/calcular está matematicamente certo antes do render final (screenshot do carrossel ou export do vídeo). Se o conteúdo já foi aprovado pelo usuário mas essa checagem encontrar um erro, corrija o cálculo/gráfico sem mudar o roteiro aprovado, a menos que o próprio erro invalide o que foi aprovado.
