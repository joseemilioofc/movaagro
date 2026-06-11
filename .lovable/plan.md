# Popular Conta Demo com Dados de Exemplo

Vou inserir 3 exemplos de cada tipo de operação na conta demo (`Teste@demo.com`), usando os papéis de **cooperativa** e **transportadora** que ela já possui.

## Dados a inserir (3 de cada)

### Como Cooperativa (origem dos pedidos)
1. **Solicitações de transporte (`transport_requests`)** — 3 pedidos com status variados (pendente, em negociação, concluído), rotas dentro de Moçambique (Quelimane→Maputo, Mocuba→Beira, Gurué→Nampula), tipos de carga diferentes (milho, arroz, soja).
2. **Cálculos de preço (`price_calculations`)** — 3 simulações de frete salvas no histórico.
3. **Alertas de preço (`price_alerts`)** — 3 alertas configurados para rotas/cargas.

### Como Transportadora (responde e opera)
4. **Disponibilidade (`transporter_availability`)** — 3 janelas de disponibilidade futuras em regiões diferentes.
5. **Frota — Viaturas (`fleet_vehicles`)** — 3 veículos (camião 10t, camião 20t, carrinha 3t) com placas, marcas e capacidades.
6. **Frota — Motoristas (`fleet_drivers`)** — 3 motoristas, cada um associado a uma viatura.
7. **Propostas (`transport_proposals`)** — 3 propostas enviadas aos pedidos acima (uma aceite, uma pendente, uma recusada).

### Operações conjuntas / pós-negociação
8. **Contratos digitais (`digital_contracts`)** — 3 contratos gerados a partir das propostas aceites (1 assinado pelos dois, 1 só pela cooperativa, 1 rascunho).
9. **Mensagens de chat (`chat_messages`)** — 3 mensagens trocadas nos pedidos.
10. **Localizações de transporte (`transport_locations`)** — 3 pontos GPS simulando rota em curso.
11. **Avaliações (`ratings`)** — 3 avaliações (cooperativa↔transportadora) em transportes concluídos.

## Abordagem técnica

- Usar a ferramenta `supabase--insert` num único bloco SQL transacional, com CTEs para reaproveitar IDs (request → proposal → contract → rating → chat → location).
- Todos os registos vinculados ao `user_id` da demo (`dfce9b8f-c554-4a9a-ab0d-e04650e8dba6`) tanto como `cooperative_id` como `transporter_id` (a conta tem ambos os papéis, então ela negocia consigo mesma — apropriado para demo).
- Telefones e contas de pagamento usam `+258 87 780 1500` (MOVA AGRO), conforme regra do projeto.
- Zambézia priorizada nas rotas de exemplo.
- Nenhum ficheiro de código alterado — apenas dados.

## Pergunta antes de avançar

Quer que a conta demo negocie consigo mesma (cooperativa + transportadora no mesmo user, mais simples e isolado), **ou** prefere que eu crie também uma segunda conta demo "contraparte" para tornar as interações mais realistas?
