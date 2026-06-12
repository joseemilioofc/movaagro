# Reativar Conta Demo + Dados Fictícios

## Objetivo
Garantir que a conta `Teste@demo.com` / `123teste123` funcione e tenha **três papéis** (Cooperativa + Transportadora + Admin), além de 3 exemplos de cada tipo de operação com dados fictícios realistas.

## Passos

### 1. Recriar/ativar a conta demo (Edge Function temporária)
- Criar `supabase/functions/activate-demo/index.ts` (sem exigir auth — uso único).
- Se já existir um user com `Teste@demo.com`, apagar e recriar via `auth.admin`.
- Email confirmado, senha `123teste123`.
- Inserir em `user_roles` os três papéis: `cooperative`, `transporter`, `admin`.
- Deploy → invocar → apagar a função (segurança).

### 2. Limpar dados antigos da demo
Antes de inserir, remover registos antigos do user demo nas tabelas afetadas para evitar duplicados / violações de unique.

### 3. Popular dados fictícios (3 de cada)

**Como Cooperativa**
- 3 `transport_requests` — Milho Quelimane→Maputo, Arroz Mocuba→Beira, Soja Gurué→Nampula (status: pendente, em negociação, concluído).
- 3 `price_calculations` — simulações de frete.
- 3 `price_alerts` — alertas configurados.

**Como Transportadora**
- 3 `transporter_availability` — janelas futuras.
- 3 `fleet_vehicles` — camião 10t, camião 20t, carrinha 3t.
- 3 `fleet_drivers` — vinculados às viaturas.
- 3 `transport_proposals` — 1 pendente, 1 aceite, 1 recusada.

**Como Admin**
- 3 `audit_logs` — login, criação de utilizador, aprovação de transportadora.
- 3 `kpi_goals` — metas mensais (entregas, receita, satisfação).
- 3 `kpi_alerts` — alertas de KPI ativos.

**Operações conjuntas / pós-negociação**
- 3 `digital_contracts` — MOVA-2026-0001/0002/0003 (1 assinado por ambos, 1 só cooperativa, 1 rascunho).
- 3 `chat_messages` — mensagens nos pedidos.
- 3 `transport_locations` — pontos GPS em rota.
- 3 `ratings` — avaliações 4–5★.

### 4. Verificação
- Login com as credenciais.
- Validar que dashboards de Cooperativa, Transportadora e Admin mostram dados.

## Detalhes técnicos
- Telefones e MOVA AGRO usam `+258 87 780 1500`.
- Zambézia priorizada nas rotas.
- `cooperative_id` e `transporter_id` = mesmo user (`dfce9b8f-c554-4a9a-ab0d-e04650e8dba6`) — negocia consigo mesma (apropriado para demo).
- Inserção via `supabase--insert` num único bloco `DO $$ ... $$` com `RETURNING` para encadear IDs.

## Credenciais finais
- **Email:** `Teste@demo.com`
- **Senha:** `123teste123`
- **Papéis:** Cooperativa + Transportadora + Admin
