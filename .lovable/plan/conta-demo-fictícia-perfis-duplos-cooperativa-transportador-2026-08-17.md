# Conta demo fictícia + perfis duplos (cooperativa & transportador)

## 1. Modo demo claramente identificado

- Marcar as contas de demonstração com um sinalizador próprio (novo campo `is_demo` no perfil), em vez de depender do email.
- Banner fixo no topo de todas as páginas autenticadas quando a conta é demo:
  "MODO DEMO — Todos os dados apresentados são fictícios e servem apenas para demonstração. Nenhuma transação representa uma operação comercial real."
- Etiqueta "DEMO" junto ao nome do utilizador no cabeçalho.

### Dados demo reescritos (100% fictícios)

Substituir os dados actuais da conta demo por um cenário coerente, sem nomes, telefones, documentos, contas ou GPS reais:

- Utilizador: Emílio José — utilizador demonstrativo · 84 000 0000 · Quelimane (simulado)
- Cooperativa Agrícola Demo
- Transportador Demo 01, Transportador Demo 02, Transportador Demo 03
- Operação exemplo: Milho · 2.500 kg · Mercado Central de Quelimane · 17.900 MZN · Concluído · Receita MOVA 3.580 MZN (comissão 20%)
- Restantes registos (pedidos, propostas, contratos, viaturas, motoristas, chat, GPS, avaliações) todos com nomes "Demo", matrículas fictícias (ex.: AAA-000-MC), NUIT/alvarás fictícios e coordenadas aproximadas de Quelimane marcadas como simuladas.

Nota: a comissão de 20% aparece apenas como valor de demonstração nos dados; não é criado nenhum motor de comissões.

## 2. Transportador pode operar também como cooperativa

- Nova secção no Perfil: "Adicionar perfil de Cooperativa".
- Requisitos verificados antes de activar: nome/empresa preenchidos, telefone válido, identidade verificada (Didit) e aceitação dos termos.
- Ao cumprir, o papel `cooperative` é adicionado à conta e o seletor de papel no cabeçalho passa a mostrar as duas opções.

## 3. Cooperativa pode operar também como transportador

- Nova secção no Perfil: "Adicionar perfil de Transportador".
- Abre o formulário de credenciamento já existente (alvará, matrícula, capacidade, carroçaria, documentos; opção empresa com frota).
- O papel `transporter` é adicionado, mas o acesso a propostas/frota só é libertado depois da aprovação do administrador — como acontece hoje com qualquer transportador.

## Notas técnicas

- Migração: coluna `profiles.is_demo boolean not null default false`; nova política em `user_roles` que permite ao próprio utilizador inserir apenas `cooperative` ou `transporter` (nunca `admin`/`secondary_admin`), com os GRANT correspondentes.
- Actualizar o gatilho `enforce_profile_update` para impedir que o utilizador altere `is_demo`.
- `AuthContext` já suporta múltiplos papéis; após adicionar um papel faz-se refetch dos papéis e activa-se o novo.
- Reescrita da função `create-demo-user` para repor, de forma idempotente, o utilizador demo com `is_demo = true` e o conjunto de dados fictícios acima (apaga e recria apenas as linhas demo).
- Componente `DemoBanner` incluído no `DashboardLayout`.
