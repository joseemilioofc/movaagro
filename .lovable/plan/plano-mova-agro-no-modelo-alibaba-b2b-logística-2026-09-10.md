# Plano: MOVA AGRO no modelo Alibaba (B2B + Logística)

## Objectivo
Transformar a MOVA AGRO num marketplace B2B que liga **quem vende a granel** (agricultores, cooperativas, vendedores grossistas) a **quem compra a granel** (retalhistas, restaurantes, mercados retalhistas, donos de negócios), garantindo o transporte através dos transportadores/empresas de frota já existentes.

## Decisões tomadas com base nas respostas
- **Scope:** manter os papéis actuais (cooperativa, transportador individual, empresa de frota) e acrescentar **vendedor grossista** e **comprador retalhista**.
- **Receita:** comissão sobre vendas + comissão sobre frete (modelo actual).
- **Pagamentos:** processados dentro da plataforma.

## Novos papéis de utilizador
1. **cooperative** — já existe; passa também a poder publicar produtos para venda.
2. **transporter** — já existe; transportador individual.
3. **fleet_company** — já existe; empresa com frota.
4. **wholesale_seller** — novo; compra a cooperativas e revende a retalhistas, ou vende produtos próprios a granel.
5. **retail_buyer** — novo; restaurantes, mercados, lojistas que compram a granel.
6. **admin / secondary_admin** — já existe; gestão e aprovações.

## Mudanças na base de dados

### 1. Extender o enum `app_role`
Adicionar `'wholesale_seller'` e `'retail_buyer'`.

### 2. Nova tabela `product_listings`
- `seller_id` (referência ao utilizador)
- `title`, `description`
- `category` (ex.: grãos, hortícolas, frutas, fertilizantes)
- `product_type` (milho, soja, arroz, etc.)
- `quantity_kg`, `min_order_kg`, `price_per_kg` em MZN
- `location` (província/distrito)
- `status` (`active`, `paused`, `sold_out`)
- `photos[]`, `quality_grade`, `harvest_date`
- Políticas RLS: vendedor gere os seus produtos; compradores e transportadores veem apenas listagens ativas.

### 3. Nova tabela `orders`
- `buyer_id`, `seller_id`
- `listing_id`
- `quantity_kg`, `price_per_kg`, `total_product_amount` MZN
- `delivery_address`, `pickup_address`
- `status` (`pending_payment`, `paid`, `preparing`, `in_transit`, `delivered`, `cancelled`, `disputed`)
- `transport_request_id` (opcional; liga ao transporte)
- `mova_commission_amount`, `mova_transport_commission_amount`
- `payment_status`, `payment_provider_reference`

### 4. Nova tabela `order_payments`
- `order_id`, `amount`, `type` (`product`, `shipping`, `commission`), `status`, `provider_reference`
- Registo auditável de todos os pagamentos.

### 5. Nova tabela `seller_wallets` (opcional, fase 2)
- Saldo retido do vendedor, levantamentos.

### 6. Ajustar `transport_requests`
Adicionar `order_id` (opcional) para que um pedido de transporte possa nascer automaticamente de uma venda.

## Mudanças na autenticação e registo

### `Auth.tsx`
- No formulário de cadastro, mostrar 4 opções de conta:
  - **Agricultor / Cooperativa**
  - **Vendedor Grossista**
  - **Comprador Retalhista**
  - **Transportador / Empresa de Frota**
- Quando o utilizador escolher transportador, manter o fluxo actual de aprovação manual.
- Vendedores e compradores passam por verificação de identidade Didit (já existente).

### `AuthContext.tsx`
- Atualizar o tipo `AppRole` para incluir os novos papéis.

## Novas páginas e dashboards

### Para o comprador retalhista
- `/marketplace` — catálogo de produtos com filtros (província, categoria, quantidade mínima, preço).
- `/buyer` — dashboard do comprador: encomendas, pagamentos pendentes, rastreio.
- `/buyer/orders/:id` — detalhe da encomenda, pagamento, contrato, chat.

### Para o vendedor grossista
- `/seller` — dashboard do vendedor: listagens, encomendas recebidas, saldo.
- `/seller/listings/new` — formulário de criação de produto.
- `/seller/orders/:id` — detalhe da venda, aceitar/rejeitar, gerar transporte.

### Ajustes nos dashboards existentes
- `CooperativeDashboard.tsx`: separar área "Meus Pedidos de Transporte" e "Meus Produtos à Venda".
- `TransporterDashboard.tsx` e `FleetDashboard.tsx`: passam a ver também encomendas que precisam de transporte (além dos pedidos de transporte tradicionais).

## Fluxo de uma venda

```text
1. Vendedor publica produto
2. Comprador encontra produto no marketplace
3. Comprador faz encomenda (quantidade, endereço de entrega)
4. Sistema calcula:
   - valor do produto
   - estimativa de frete (com base no preço por kg/distância actual)
   - comissão MOVA sobre venda (ex.: 5%)
   - comissão MOVA sobre frete (ex.: 20%)
5. Comprador paga o total (produto + frete) dentro da plataforma
6. Pagamento fica em escrow até confirmação de entrega
7. Vendedor prepara a carga
8. Transportador aceita o frete (ou o vendedor escolhe um)
9. GPS rastreia a entrega
10. Comprador confirma receção
11. Fundos são libertados para vendedor e transportador (menos comissões MOVA)
```

## Modelo de comissões

- **Comissão sobre venda:** percentagem configurável (default 5%) sobre o valor do produto.
- **Comissão sobre transporte:** percentagem configurável (default 20%) sobre o valor do frete.
- Valores guardados em `orders.mova_commission_amount` e `orders.mova_transport_commission_amount`.
- Admins podem alterar as percentagens em `/admin/settings`.

## Pagamentos dentro da plataforma

### Fase 1 (MVP)
- Integrar com provedor de pagamentos móveis de Moçambique (M-Pesa / Emola) ou provedor internacional suportado (Stripe/PayPal se disponível para Moçambique).
- O utilizador recebe referência de pagamento e confirmação manual por admin (semelhante ao fluxo actual de propostas com `payment_proof_url`).

### Fase 2
- Integração directa com API do provedor de pagamentos para pagamentos automáticos e escrow.

## Aprovações e segurança
- Transportadores mantêm aprovação manual com documentação (já implementada).
- Vendedores grossistas e compradores retalhistas passam por verificação de identidade Didit.
- Admins podem suspender listagens, encomendas ou contas.

## Mudanças na landing page e comunicação
- `Index.tsx`: mensagem principal passa a ser "Marketplace B2B + Logística Agrícola em Moçambique".
- Destacar os 4 públicos: quem vende, quem compra, quem transporta.
- Atualizar FAQ e páginas legais para refletir marketplace (termos, privacidade, contrato de intermediação).

## Ordem de implementação sugerida

1. Base de dados: novos papéis, tabelas `product_listings`, `orders`, `order_payments`.
2. Autenticação: novas opções de registo e tipos de papel.
3. Marketplace: catálogo público e página de produto.
4. Dashboard do vendedor: criar/listar produtos, gerir encomendas.
5. Dashboard do comprador: marketplace, carrinho/encomenda, pagamento.
6. Ligação ao transporte: gerar `transport_request` a partir de uma `order`.
7. Comissões e pagamentos: cálculo automático e fluxo de confirmação.
8. Ajustes legais e landing page.
9. Testes com conta demo (dados fictícios).

## Notas técnicas
- Usar Lovable Cloud / Supabase para base de dados e auth.
- Manter design tokens actuais; criar componentes reutilizáveis para cards de produto, encomendas e pagamentos.
- Reutilizar `TransportRequestForm`, `DigitalContract`, `GPSTrackingMap` e chat já existentes.
- Todos os valores monetários continuam em MZN.
