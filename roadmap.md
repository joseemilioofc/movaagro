# Roadmap — MOVA AGRO (modelo marketplace estilo Alibaba)

## Concluído
- Novos papéis: `wholesale_seller` e `retail_buyer` no registo, navegação e redirecionamentos.
- Tabelas `product_listings`, `orders`, `order_payments`, `seller_wallets` com RLS e GRANTs.
- Páginas: `/marketplace`, `/seller`, `/buyer`, `/seller/listings/new`, `/buyer/orders/new`.
- Landing page estilo Alibaba: hero, 4 CTAs, Como Funciona, Vantagens, Tabela de Preços, FAQ, CTA final.
- Comissões: 5% vendas / 20% frete (constantes em CreateOrder).
- Home: ações rápidas por papel; admin vê todas. Breadcrumb warning e 406 corrigidos.

## Pendente
- [ ] Popular a conta demo (Teste@demo.com) com exemplos de marketplace: 3 listagens, 3 encomendas fictícias + aviso "MODO DEMO".
- [ ] CooperativeDashboard: separar "Meus Pedidos de Transporte" e "Meus Produtos à Venda".
- [ ] TransporterDashboard/FleetDashboard: mostrar encomendas que precisam de transporte.
- [ ] Gerar `transport_request` automaticamente a partir de uma encomenda com transporte.
- [ ] Comissões configuráveis por admin em /admin/settings (substituir constantes).
- [ ] Página de detalhe/fluxo de pagamento da encomenda (fase 1: confirmação manual M-Pesa/e-Mola; escrow fase 2).
- [ ] Ajustes legais: termos/privacidade a mencionar marketplace B2B.
- [ ] Linter: 11 avisos SECURITY DEFINER — mover helpers (has_role etc.) para schema privado.
