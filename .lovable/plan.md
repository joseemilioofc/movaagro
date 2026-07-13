# Atualização Jurídica – MOVA AGRO

Vou publicar o conteúdo jurídico que enviaste na plataforma, criando novas páginas e atualizando as existentes para refletir o posicionamento de **plataforma de intermediação tecnológica** (não transportadora).

## 1. Páginas a atualizar (conteúdo existente)

- **`src/pages/Terms.tsx`** — substituir totalmente pelo novo texto "TERMOS DE USO – MOVA AGRO" (identificação da plataforma, natureza dos serviços, limitação de responsabilidade).
- **`src/pages/Privacy.tsx`** — substituir pelo novo texto da Política de Privacidade, com referência à Lei n.º 3/2017 (Moçambique) e GDPR.
- **`src/pages/Security.tsx`** — manter como "Política de Segurança" (já existe no rodapé).

## 2. Páginas novas a criar

- **`src/pages/Cookies.tsx`** — Política de Cookies.
- **`src/pages/GPSConsent.tsx`** — Termo de Consentimento para Geolocalização e GPS.
- **`src/pages/IntermediationContract.tsx`** — Contrato de Intermediação.
- **`src/pages/DataRetention.tsx`** — Política de Retenção de Dados.
- **`src/pages/AcceptableUse.tsx`** — Política de Uso Aceitável.
- **`src/pages/LegalContact.tsx`** — Contacto Jurídico (movaagro@gmail.com, endereço Quelimane).

Todas seguem o layout existente (header com logo + botão Voltar, `Footer`, tipografia `prose`).

## 3. Rotas

Adicionar em **`src/App.tsx`** as 6 novas rotas:
`/cookies`, `/gps-consent`, `/intermediation`, `/data-retention`, `/acceptable-use`, `/legal-contact`.

## 4. Rodapé (`src/components/Footer.tsx`)

Reorganizar a secção **Informação Legal** com a lista jurídica recomendada:

- Termos de Uso
- Política de Privacidade
- Política de Cookies
- Política de Segurança
- Política de Retenção de Dados
- Consentimento de GPS
- Contrato de Intermediação
- Política de Uso Aceitável
- Contacto Jurídico

(Mantenho "Sobre Nós" na secção Comercial junto a "Empresa", já que não consta na lista jurídica.)

Atualizar o bloco de copyright para o texto sugerido:
> MOVA AGRO, LDA — Plataforma Digital de Intermediação de Transporte Agrícola. Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Rua 1115, Moçambique. E-mail: movaagro@gmail.com. © 2026 MOVA AGRO, LDA. Todos os direitos reservados.

Mantenho NUIT / Registo Comercial / Alvará na mesma linha (já estão no rodapé atual).

## 5. Detalhes técnicos

- Componentes reutilizam `Footer`, `Button`, `Link` já existentes — sem novas dependências.
- Conteúdo em PT, sem hardcoded colors (usa tokens semânticos `text-foreground`, `text-muted-foreground`, `bg-card`).
- Cada página tem `<h1>` único e estrutura semântica para SEO.
- Sem alterações em backend, RLS, edge functions ou lógica de negócio.

Confirmas para implementar?
