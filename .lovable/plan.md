# Atualização do endereço da MOVA AGRO, LDA

## Objectivo
Substituir o endereço antigo `Rua 1115` pelo novo endereço `Avenida: Eduardo Mondlane` em todos os locais onde aparece na plataforma.

## Alterações a fazer
Atualizar o texto do endereço nos seguintes ficheiros:

1. `src/components/Footer.tsx` — bloco de copyright.
2. `src/pages/Company.tsx` — campo de endereço da empresa.
3. `src/pages/LegalContact.tsx` — campo de endereço de contacto jurídico.
4. `src/pages/Terms.tsx` — secção de identificação da plataforma.
5. `src/pages/Privacy.tsx` — duas ocorrências (secção inicial e contacto do encarregado).
6. `src/pages/Cookies.tsx` — secção de identificação do responsável.
7. `src/pages/GPSConsent.tsx` — secção de identificação do responsável.

## Validação
Após as edições, executar uma pesquisa por "Rua 1115" para garantir que não restam ocorrências antigas.

## Notas
- Alteração apenas de conteúdo textual; sem impacto em lógica de negócio, base de dados ou autenticação.
- O novo endereço completo passa a ser: Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida: Eduardo Mondlane, Moçambique.
