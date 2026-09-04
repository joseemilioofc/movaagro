# Retirar o acesso de Admin da conta demo

A conta demo `teste@demo.com` (marcada como demo) tem atualmente três acessos: Cooperativa, Transportadora e Admin.

## O que muda

- Remover o papel **Admin** da conta demo.
- A conta fica apenas com **Cooperativa + Transportadora**, mantendo o seletor de perfil no cabeçalho e todos os dados simulados existentes.
- Nenhuma outra conta é afetada.

## Detalhe técnico

- Operação de dados (não é alteração de estrutura): apagar a linha de `user_roles` com `role = 'admin'` para o utilizador `c141fb5f-b71b-430a-8c82-2ec9ad4a8dad`.
- Verificação após a execução: confirmar que restam apenas `cooperative` e `transporter`.
- Se a sessão demo estiver aberta, será preciso sair e voltar a entrar (ou trocar de perfil) para o painel de Admin desaparecer.
