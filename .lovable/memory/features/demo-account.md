---
name: Conta demo e perfis duplos
description: Regras da conta de demonstração (dados 100% fictícios, banner MODO DEMO) e auto-activação de perfil cooperativa/transportadora
type: feature
---

## Conta demo
- Conta: `Teste@demo.com`. Perfil marcado com `profiles.is_demo = true`.
- Só pode conter dados fictícios/simulados: nomes ("Emílio José — utilizador demonstrativo", "Transportador Demo 01", "Cooperativa Agrícola Demo"), telefone `84 000 0000`, localização "Quelimane — dados simulados". Nunca dados pessoais, documentos, contas bancárias, GPS ou transações reais.
- Exemplo canónico: Milho, 2.500 kg, destino Mercado Central de Quelimane, 17.900 MZN, receita MOVA 3.580 MZN (comissão 20%), estado Concluído.
- `DemoBanner` mostra no topo do dashboard: "⚠️ MODO DEMO — Todos os dados apresentados são fictícios...".

## Perfis duplos
- Qualquer utilizador pode activar o perfil em falta (cooperativa ou transportadora) em `/profile` via `RoleUpgradeCard`.
- Transportadora activada exige submissão e aprovação de alvará/matrícula/capacidade/carroçaria antes de ficar visível.
- Papel activo guardado em `localStorage` (`mova:active-role`), seletor no cabeçalho.
