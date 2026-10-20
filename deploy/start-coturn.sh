#!/bin/sh
# Coturn self-hosted — lê credenciais do ambiente (.env), sem secrets no compose.
set -eu
USER_NAME="${TURN_USER:-vintage}"
PASS="${TURN_PASS:?TURN_PASS required}"
REALM="${TURN_REALM:-vintagedevstack.com.br}"
EXT_IP="${TURN_HOST:-216.22.27.191}"

exec turnserver -n \
  --log-file=stdout \
  --simple-log \
  --fingerprint \
  --lt-cred-mech \
  --realm="$REALM" \
  --user="${USER_NAME}:${PASS}" \
  --external-ip="$EXT_IP" \
  --listening-port=3478 \
  --min-port=49160 \
  --max-port=49200 \
  --no-cli \
  --no-tls \
  --no-dtls \
  --no-multicast-peers \
  --stale-nonce=600
