
# Plano: Painel de Empresa Transportadora (Frota)

## Visão geral
Adicionar suporte a **empresas com frota** dentro do role existente `transporter`, com auto-cadastro público, aprovação por admin, e um painel dedicado para gerir viaturas, motoristas e KPIs da frota. Transportadores individuais continuam com o painel atual.

## 1. Modelo de dados (migração)

**Extensão de `transporter_details`:**
- `is_company` (boolean, default false) — marca a conta como empresa
- `company_name`, `company_nuit`, `company_address` (text) — dados fiscais

**Nova tabela `fleet_vehicles`:**
- `transporter_id` (uuid → auth.users)
- `plate` (matrícula), `vehicle_type`, `capacity_kg`, `year`, `brand`, `model`
- `photo_url`, `document_url`, `status` (active/maintenance/inactive)

**Nova tabela `fleet_drivers`:**
- `transporter_id` (uuid → auth.users)
- `name`, `phone`, `license_number`, `license_expiry`
- `assigned_vehicle_id` (uuid → fleet_vehicles, nullable)
- `status` (active/inactive)

**Extensão de `transport_proposals`** (atribuição na confirmação):
- `assigned_vehicle_id` (uuid, nullable)
- `assigned_driver_id` (uuid, nullable)

Cada tabela com RLS: a própria empresa (auth.uid = transporter_id) faz CRUD; admins veem tudo; cooperativa vê viatura/motorista atribuídos do seu pedido. GRANTs explícitos para `authenticated` e `service_role`.

Buckets: reutilizar/criar `fleet-vehicles` (privado) para fotos e documentos das viaturas, com policies por owner folder.

## 2. Auto-cadastro com aprovação

- Em `/auth`, opção "Empresa de Transporte" no signup do transportador (toggle "Sou empresa com frota").
- Ao registar com flag empresa: cria `transporter_details` com `is_company=true` e `approval_status='pending'`.
- Admin aprova no fluxo existente `/admin/transporter-approvals` (adicionar coluna/badge "Empresa").

## 3. Painel da Empresa (`/fleet`)

Detecta `is_company=true` ao entrar em `/transporter` e redireciona para `/fleet`. Novo `FleetDashboard` com tabs:

- **Pedidos** — mesma listagem do transportador individual; ao confirmar/aceitar uma proposta abre dialog para escolher **viatura + motorista** disponíveis.
- **Viaturas** — tabela com CRUD (form com upload de foto/documento).
- **Motoristas** — tabela com CRUD, atribuição opcional a viatura.
- **KPIs da Frota** — cards e gráficos:
  - Receita total e por mês
  - Viagens por viatura
  - Ranking de motoristas (viagens, avaliação média)
  - Taxa de utilização da frota

## 4. Navegação e papéis

- `DashboardLayout` mostra item "Frota" quando `is_company=true` (mantendo role `transporter`).
- Hook `useTransporterProfile` para ler `is_company` uma vez e cachear.
- Mobile bottom-nav atualizada com Viaturas/Motoristas.

## 5. Detalhes técnicos

- Triggers `BEFORE UPDATE` para impedir mudanças em `transporter_id` nas tabelas de frota.
- Função `is_fleet_company(_uid)` (SECURITY DEFINER) para uso em RLS de outras tabelas que precisem distinguir.
- Atualização do edge function `create-user` opcional para permitir admin criar empresa pré-aprovada.
- Memória: criar `mem://features/fleet-companies` documentando o modelo.

## Fora de escopo (futuro)
- Login individual para motoristas (continuam geridos pela empresa).
- Tracking GPS por viatura específica (usar o sistema atual no nível do pedido).
