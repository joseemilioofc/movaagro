Alteração simples no botão de navegação superior direito do painel autenticado.

Objetivo: trocar o label visível do botão ao lado de "Perfil" e antes de "Sair".

Arquivo afetado:
- `src/components/DashboardLayout.tsx` (linha ~125)

Mudança exata:
- De: `<span className="hidden sm:inline">Início</span>`
- Para: `<span className="hidden sm:inline">Home</span>`

Sem impacto em rotas, ícones ou outra lógica — apenas o texto exibido.