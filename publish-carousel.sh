#!/bin/bash
# Usage: publish-carousel.sh <day-folder-name> <num-slides> <caption-windows-path>
set -e
source "/c/Users/Suporte/Downloads/professor eric instagram/.env.instagram"

DAY="$1"
N="$2"
CAPTION_PATH="$3"
BASE_URL="https://raw.githubusercontent.com/ericsouzag/sric-carrossel-diario/master/serie-funcao-2grau/$DAY"

echo "=== Publishing $DAY ($N slides) ==="

CHILD_IDS=()
for i in $(seq 1 "$N"); do
  IMG_URL="$BASE_URL/slide_${i}.png"
  RESP=$(curl -s -X POST "https://graph.facebook.com/v21.0/${IG_USER_ID}/media" \
    --data-urlencode "image_url=${IMG_URL}" \
    --data-urlencode "is_carousel_item=true" \
    --data-urlencode "access_token=${INSTAGRAM_ACCESS_TOKEN}")
  echo "child $i: $RESP"
  CID=$(echo "$RESP" | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
  if [ -z "$CID" ]; then echo "FAILED to create child $i"; exit 1; fi
  CHILD_IDS+=("$CID")
done

CHILDREN=$(IFS=,; echo "${CHILD_IDS[*]}")
echo "children: $CHILDREN"

PARENT_RESP=$(curl -s -X POST "https://graph.facebook.com/v21.0/${IG_USER_ID}/media" \
  --data-urlencode "media_type=CAROUSEL" \
  --data-urlencode "children=${CHILDREN}" \
  --data-urlencode "caption@${CAPTION_PATH}" \
  --data-urlencode "access_token=${INSTAGRAM_ACCESS_TOKEN}")
echo "parent: $PARENT_RESP"
PARENT_ID=$(echo "$PARENT_RESP" | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')
if [ -z "$PARENT_ID" ]; then echo "FAILED to create parent container"; exit 1; fi

for i in $(seq 1 10); do
  STATUS_RESP=$(curl -s "https://graph.facebook.com/v21.0/${PARENT_ID}?fields=status_code,status&access_token=${INSTAGRAM_ACCESS_TOKEN}")
  echo "status check $i: $STATUS_RESP"
  echo "$STATUS_RESP" | grep -q '"status_code":"FINISHED"' && break
  echo "$STATUS_RESP" | grep -q '"status_code":"ERROR"' && { echo "ERROR status, aborting"; exit 1; }
  sleep 5
done

PUBLISH_RESP=$(curl -s -X POST "https://graph.facebook.com/v21.0/${IG_USER_ID}/media_publish" \
  --data-urlencode "creation_id=${PARENT_ID}" \
  --data-urlencode "access_token=${INSTAGRAM_ACCESS_TOKEN}")
echo "publish: $PUBLISH_RESP"
MEDIA_ID=$(echo "$PUBLISH_RESP" | grep -o '"id":"[0-9]*"' | head -1 | grep -o '[0-9]*')

curl -s "https://graph.facebook.com/v21.0/${MEDIA_ID}?fields=permalink,media_product_type,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}"
echo
echo "=== Done: $DAY ==="
