#!/usr/bin/env bash
# Deploy Vintage DevStack na VPS (Docker Compose)
# Uso:
#   ./scripts/deploy-vps.sh root@216.22.27.191
# Requer SSH com chave ou agent.

set -euo pipefail

TARGET="${1:-}"
REMOTE_DIR="${REMOTE_DIR:-/opt/vintagedevstack}"

if [[ -z "$TARGET" ]]; then
  echo "Uso: $0 user@216.22.27.191"
  exit 1
fi

echo "==> Sync código → $TARGET:$REMOTE_DIR"
ssh "$TARGET" "mkdir -p $REMOTE_DIR"
rsync -az --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude .git \
  --exclude server/node_modules \
  ./ "$TARGET:$REMOTE_DIR/"

echo "==> Subindo stack Docker"
ssh "$TARGET" "bash -s" <<EOF
set -euo pipefail
cd $REMOTE_DIR
if [[ ! -f .env ]]; then
  cp .env.vps.example .env
  echo "ATENÇÃO: edite $REMOTE_DIR/.env com senhas reais antes de produção"
fi
docker compose pull || true
docker compose build --no-cache
docker compose up -d
docker compose ps
curl -sf http://127.0.0.1:\${HTTP_PORT:-8080}/api/health || true
EOF

echo "==> OK. Aponte Caddy/nginx para 127.0.0.1:8080 (ver deploy/Caddyfile.example)"
