# Atualização integral da Informação Legal

## Objectivo
Substituir o conteúdo das páginas legais pelo texto oficial enviado (versão 1.0 — 13 de Julho de 2026), com o endereço já corrigido para **Avenida: Eduardo Mondlane** (o documento enviado ainda traz "Rua 1115"; será substituído em todas as ocorrências).

## Páginas a actualizar com o novo texto integral
1. Termos de Uso — `src/pages/Terms.tsx`
2. Política de Privacidade — `src/pages/Privacy.tsx`
3. Política de Cookies — `src/pages/Cookies.tsx`
4. Consentimento de GPS — `src/pages/GPSConsent.tsx`
5. Política de Retenção e Eliminação de Dados — `src/pages/DataRetention.tsx`
6. Política de Segurança da Informação — `src/pages/Security.tsx`
7. Política de Uso Aceitável — `src/pages/AcceptableUse.tsx`
8. Contrato de Intermediação de Serviços de Transporte Agrícola — `src/pages/IntermediationContract.tsx`

## Página nova
9. **Aviso Legal** — o documento enviado inclui um "AVISO LEGAL DA PLATAFORMA MOVA AGRO" que ainda não existe na plataforma. Será criada a página `src/pages/LegalNotice.tsx`, registada a rota `/legal-notice` em `src/App.tsx` e adicionado o link na secção "Informação Legal" do rodapé.

## Contacto Jurídico
`src/pages/LegalContact.tsx` mantém-se (já actualizado com o novo endereço); apenas é confirmada a coerência dos dados de contacto.

## Detalhes técnicos
- Cada página continua a usar o componente `LegalPageLayout` com `title` e `updatedAt="13 de Julho de 2026"`, mantendo a estrutura actual de `<section>`, `<h2>`, listas e classes de estilo existentes.
- Conteúdo transcrito integralmente do ficheiro enviado, secção a secção, sem resumos.
- Blocos de contacto padronizados: MOVA AGRO, LDA · Província da Zambézia · Distrito de Quelimane · Bairro Cimento · Avenida: Eduardo Mondlane · Moçambique · movaagro@gmail.com.
- Validação final: pesquisa por "Rua 1115" deve devolver zero resultados.

## Fora de âmbito
Sem alterações a base de dados, autenticação ou lógica de negócio — apenas conteúdo e uma rota nova.
