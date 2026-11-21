#!/bin/bash
# Publica o PROXIMO dia ainda nao publicado da serie, um por dia.
# So publica um carrossel que ja tem pasta pronta (slide_N.png) e legenda.txt --
# nunca gera conteudo novo aqui. Se o proximo dia nao existir ainda (ex. ainda
# nao foi aprovado), nao faz nada e sai sem erro -- nao trava o agendamento.
# DRY_RUN=1 roda tudo sem publicar de verdade e sem avancar o estado (so teste).

set -e
# DIR = pasta onde este script esta, nao um caminho fixo -- assim funciona tanto
# local (Windows/Git-Bash) quanto na nuvem (GitHub Actions, outro caminho).
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERIE_NOME="${1:-serie-funcao-2grau}"
SERIE="$DIR/$SERIE_NOME"
STATE_FILE="$SERIE/.ultimo-dia-publicado"
LOG="$DIR/publish-next-day.log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG"; }

LAST=$(cat "$STATE_FILE" 2>/dev/null || echo 0)
NEXT=$((LAST + 1))
NEXT_PADDED=$(printf "%02d" "$NEXT")

FOLDER=$(ls -d "$SERIE"/dia-${NEXT_PADDED}-* 2>/dev/null | head -1)

if [ -z "$FOLDER" ]; then
  log "Dia $NEXT ainda nao tem pasta pronta em $SERIE_NOME/. Nada publicado hoje."
  exit 0
fi

DAYNAME=$(basename "$FOLDER")
CAPTION="$FOLDER/legenda.txt"
N=$(ls "$FOLDER"/slide_*.png 2>/dev/null | wc -l)

if [ ! -f "$CAPTION" ]; then
  log "ERRO: $DAYNAME nao tem legenda.txt. Nada publicado, corrija antes de tentar de novo."
  exit 1
fi
if [ "$N" -eq 0 ]; then
  log "ERRO: $DAYNAME nao tem slide_N.png (pode ser um Reel, nao carrossel -- esse script so publica carrossel). Nada publicado."
  exit 1
fi

log "Publicando $DAYNAME ($N slides)...${DRY_RUN:+ [DRY-RUN]}"
bash "$DIR/publish-carousel.sh" "$SERIE_NOME" "$DAYNAME" "$N" "$CAPTION" 2>&1 | tee -a "$LOG"

if [ "${PIPESTATUS[0]}" -eq 0 ]; then
  if [ "$DRY_RUN" = "1" ]; then
    log "[dry-run] $DAYNAME simulado com sucesso. Estado NAO alterado (e so teste)."
  else
    echo "$NEXT" > "$STATE_FILE"
    log "$DAYNAME publicado com sucesso. Estado atualizado para $NEXT."
  fi
else
  log "ERRO ao publicar $DAYNAME. Estado NAO avancado -- vai tentar o mesmo dia de novo amanha."
  exit 1
fi
