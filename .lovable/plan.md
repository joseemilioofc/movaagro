## Alterações em `src/components/DashboardLayout.tsx`

1. Renomear o label do botão no canto superior direito de **"Início"** para **"Home"**.
2. Renderizar esse botão **apenas quando** `location.pathname === "/home"`. Nas demais páginas autenticadas, ele fica oculto.
3. Manter o ícone `Home` (lucide-react) e o link para `/`.

Sem mudanças em lógica de negócio, navegação mobile inferior ou menu público.