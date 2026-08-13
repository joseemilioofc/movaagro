# Reparar a conta demo e simular todas as operações

## Diagnóstico (verificado na base de dados)

A conta `teste@demo.com` existe e está confirmada, mas:

- Tem **dois papéis** (cooperativa + transportadora). O código que lê o papel do utilizador usa uma consulta que exige **exatamente um** resultado — com dois papéis devolve erro e o papel fica `null`. É por isso que a conta entra mas não abre nenhum painel.
- Não tem papel de **admin**.
- Não tem registo de **transportadora aprovada**, por isso os módulos de propostas e frota ficam bloqueados.
- Não tem **nenhum dado**: 0 pedidos, 0 propostas, 0 contratos, 0 viaturas, 0 motoristas, 0 avaliações, 0 cálculos de preço (os dados antigos pertenciam a um utilizador demo anterior que já não existe).

## O que vai ser feito

### 1. Suporte a múltiplos papéis
- Passar a carregar **todos** os papéis do utilizador em vez de um só (sem erro quando há vários).
- Escolher o painel activo por prioridade (admin > cooperativa > transportadora) e guardar a escolha.
- Adicionar um **seletor de papel** no topo do painel, visível apenas para quem tem mais de um papel, para alternar entre Cooperativa / Transportadora / Admin.

### 2. Conta demo funcional
- Atribuir também o papel **admin** à conta demo.
- Criar o registo de transportadora **aprovada** (alvará, matrícula, capacidade, carroçaria) para desbloquear propostas e frota.
- Reescrever a função de criação da conta demo para que, ao ser executada de novo, reponha tudo (papéis + dados) de forma idempotente, mantendo o mesmo utilizador em vez de o apagar.

### 3. Cenário completo de operações
Dados fictícios coerentes, em moeda MZN e localidades de Moçambique (Zambézia prioritária), cobrindo todos os estados do fluxo:

- **Pedidos de transporte**: pendente, em negociação, aceite/em trânsito, concluído, cancelado.
- **Propostas**: pendente, aceite, rejeitada, com comprovativo de pagamento e confirmação de admin.
- **Contratos digitais**: por assinar, assinado por uma parte, assinado pelas duas.
- **Frota**: 3 viaturas (activa, em manutenção, inactiva) e 3 motoristas com documentos e viatura atribuída.
- **Chat** de negociação com mensagens das duas partes.
- **GPS**: pontos de rota para o transporte em trânsito.
- **Avaliações** recebidas e dadas, **cálculos de preço**, **alertas de preço**, **disponibilidade** do transportador e **registos de auditoria**.

## Notas técnicas

- Leitura de papéis em `src/contexts/AuthContext.tsx`: substituir `.single()` por leitura em lista, expondo `roles: AppRole[]` + `role` activo + `setActiveRole`; manter `role` para não partir os componentes existentes.
- Seletor de papel no `DashboardLayout`, com persistência em `localStorage` e redireccionamento para o painel correspondente.
- Redirecções de `/home` e `Auth` passam a usar o papel activo.
- Semear os dados por migração SQL fixada ao id da conta demo (`c141fb5f-…`), com `ON CONFLICT` para poder correr novamente; a função `create-demo-user` deixa de apagar o utilizador e passa a repor papéis e dados.
- Sem alterações de esquema nem de políticas de acesso: só inserção de linhas e ajustes de frontend.
