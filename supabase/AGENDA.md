# Agenda de videochamadas

## Produção recomendada (VPS)
Ver **`DEPLOY_VPS.md`**: Postgres + API Node + Jitsi embutido em `/call/:id`.
Frontend usa `VITE_API_URL=/api` (sem depender do Supabase).

## O que foi entregue
- Página pública `/agenda` — consulta e solicitação de horário
- Admin `/admin/agenda` — confirmar e gerar sala Vintage
- Call `/call/:id` — videochamada Jitsi no site
- Login `/auth/login`
- Janela: **segunda a quinta, 17h–22h (America/Sao_Paulo)**, slots de **30 min**
- Status inicial: **pending** (você confirma)
- Antecedência mínima: 2h · horizonte: 14 dias

## Setup Supabase (legado / opcional)
1. Crie um projeto no Supabase (ou use o existente).
2. No SQL Editor, execute o arquivo:
   `supabase/migrations/20260909_agenda.sql`
3. Em Authentication → Users, crie seu usuário admin.
4. Em Table Editor → `profiles`, garanta uma linha com seu `id` = `auth.users.id` e `is_admin = true`.
5. No site, configure `.env.local`:

```bash
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

6. `npm run dev` e abra `/agenda`.

## Fluxo
1. Cliente escolhe dia/horário e envia dados.
2. Booking fica `pending` e ocupa o slot.
3. Em `/admin/agenda`, confirme e cole o link da call.
4. (Fase 2) Notificações por e-mail/WhatsApp.

## Rotas
| Rota | Uso |
|------|-----|
| `/agenda` | Público |
| `/auth/login` | Login admin |
| `/admin/agenda` | Gestão |
