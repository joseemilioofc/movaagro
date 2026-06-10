Tornar o botão da barra superior (ao lado de "Perfil") contextual:

- Quando estiver em `/home` → mostrar botão **"Início"** que leva para `/` (página de boas-vindas / landing pública).
- Quando estiver em qualquer outra rota → mostrar botão **"Home"** que leva para `/home` (painel do utilizador).

Arquivo afetado:
- `src/components/DashboardLayout.tsx`

Implementação:
- Usar `useLocation()` (já importado) para detectar `location.pathname === "/home"`.
- Renderizar condicionalmente o `<Link>` com `to` e o `<span>` com o label correto.
- Ícone permanece `Home` em ambos os casos.

Sem mudanças em rotas, lógica de auth ou outros componentes.