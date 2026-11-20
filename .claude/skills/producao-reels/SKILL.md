---
name: producao-reels
description: Regras padrão obrigatórias para qualquer Reel (vídeo) do Professor Σric — zona segura do cabeçalho e capa do feed. Use sempre que for criar um novo gerador de Reel (gen-reel-*.js) ou exportar um vídeo (export-reel.js), mesmo que o pedido não mencione essas regras explicitamente.
---

# Regras de produção de Reels

Essas regras valem pra TODO Reel novo, em qualquer série/tema. Nasceram de erros reais já cometidos e corrigidos — não são preferência estética, são requisitos.

## 1. Zona segura do cabeçalho

O Instagram sobrepõe o avatar/nome de usuário por cima da parte de cima do vídeo nos Reels. Qualquer cabeçalho, tag ou texto que comece antes disso fica escondido atrás dessa UI.

**Regra:** nenhum elemento de cabeçalho/texto pode começar acima de `top:170px`. O rodapé (`.footer`) deve ser ancorado por `bottom:`, nunca por um `top:` fixo, porque senão colide com conteúdo de altura variável acima dele.

```css
.header{ position:absolute; top:170px; left:48px; right:48px; ... }
```

Todo `gen-reel-*.js` existente já segue isso (`gen-reel.js`, `gen-reel-bola.js`, `gen-reel-terrenos.js`, `gen-reel-grafico.js`). Um gerador novo tem que seguir o mesmo padrão.

## 2. Capa do feed (thumbnail)

**O problema:** o Instagram gera a miniatura do Reel no feed a partir dos primeiros frames do vídeo. Como todo Reel abre com o fundo em gradiente (azul/grafite) sem nada desenhado ainda, toda publicação nova ficava com a MESMA miniatura no feed — visualmente repetitivo e estranho pra quem rola o perfil.

**A solução (já implementada em `reels/export-reel.js`):** depois de capturar a animação inteira, o exportador prefixa automaticamente ~180ms de frames (poucos, imperceptível ao assistir) repetindo a ÚLTIMA tela do vídeo — a de fechamento/CTA, que é sempre diferente em cada Reel (tem o headline, a tag do dia, etc.). Isso faz o Instagram pegar essa imagem como miniatura em vez do fundo vazio.

Isso é automático: **todo Reel exportado via `node export-reel.js <slug>` já sai com a capa corrigida.** Não precisa fazer nada manual — só não remover essa etapa do script ao editar `export-reel.js`.

Se um gerador de Reel não seguir o padrão `reel-<slug>.html` + `reel-<slug>.meta.json` + export via `export-reel.js` (ex. um script totalmente novo e isolado), a mesma lógica de prefixar cópias do último frame tem que ser replicada nele.

## Checklist antes de considerar um Reel pronto

- [ ] `.header`/texto de abertura não começa acima de `top:170px`.
- [ ] `.footer` ancorado por `bottom:`, não por `top:` fixo.
- [ ] Exportado via `export-reel.js` (ou replicando a lógica de capa manualmente).
- [ ] Matemática/gráficos conferidos pela skill `math-content-check` antes do export, se o Reel tiver equação ou cálculo.
