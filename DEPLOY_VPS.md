# Deploy VPS — Vintage DevStack

IP alvo: **216.22.27.191** (Caddy já responde HTTPS).

## O que sobe
| Serviço | Função |
|---------|--------|
| `web` (nginx) | Site estático + proxy `/api` |
| `api` (Node) | Agenda + login admin JWT + salas de vídeo |
| `db` (Postgres 16) | Banco da agenda |

Videochamadas usam **Jitsi Meet** embutido em `/call/:bookingId` (estável, sem API key).

## Pré-requisitos na VPS
- Docker + Docker Compose plugin
- Rede Docker externa `clube_clube` (Caddy compartilhado do Clube)
- SSH para o usuário de deploy
- Porta host `8080` já é do Workana — Vintage usa `127.0.0.1:8090`

## Deploy rápido
```bash
# na sua máquina, com SSH funcionando:
cp .env.vps.example .env   # edite senhas
./scripts/deploy-vps.sh root@216.22.27.191
```

Ou na própria VPS:
```bash
cd /opt/vintagedevstack
cp .env.vps.example .env && nano .env
docker compose up -d --build
curl http://127.0.0.1:8090/api/health
```

## Caddy (exemplo)
Veja `deploy/Caddyfile.example` — `reverse_proxy vintage-web-1:80` na rede `clube_clube`.
Cole o bloco em `/opt/clube/Caddyfile` **e** `/opt/clube/src/Caddyfile` (deploys do Clube sobrescrevem).

## Admin
- Login: `/auth/login`
- Credenciais: `ADMIN_EMAIL` / `ADMIN_PASSWORD` do `.env`
- Fluxo: confirmar agendamento → gera sala → cliente entra em `/call/:id`

## Variáveis importantes
Preencha no `.env` (sem defaults inseguros no Compose):
```bash
POSTGRES_PASSWORD=$(openssl rand -hex 24)
JWT_SECRET=$(openssl rand -hex 32)
ADMIN_EMAIL=admin@vintagedevstack.com.br
ADMIN_PASSWORD=  # senha forte
PUBLIC_SITE_URL=https://www.vintagedevstack.com.br
JITSI_DOMAIN=meet.jit.si
VITE_API_URL=/api
```

## DNS + Caddy (ordem importante)
1. Stack sobe em `127.0.0.1:8090` e `vintage-web-1` na rede `clube_clube` — valide com `curl http://127.0.0.1:8090/api/health`.
2. Aponte `www.vintagedevstack.com.br` e o apex (A) para `216.22.27.191` (corte o Vercel).
3. Só então cole/ative o bloco de `deploy/Caddyfile.example` em `/opt/clube/Caddyfile` **e** `/opt/clube/src/Caddyfile`, e rode `docker exec clube-caddy-1 caddy reload --config /etc/caddy/Caddyfile`.

Ativar o bloco Caddy com DNS ainda na Vercel faz o ACME falhar.
