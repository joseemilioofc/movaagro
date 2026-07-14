# Atualização Jurídica – Documentos 1 a 4 de 9

Vou substituir integralmente o conteúdo das 4 páginas legais existentes pelos novos textos v1.0 (13 de julho de 2026) fornecidos.

## Arquivos a atualizar

1. **`src/pages/Terms.tsx`** — Termos de Uso da Plataforma MOVA AGRO (Documento 1 de 9, texto já enviado anteriormente).
2. **`src/pages/Privacy.tsx`** — Política de Privacidade (Documento 2 de 9): 20 seções, da apresentação às disposições finais, com referências à Lei nº 3/2017 e GDPR.
3. **`src/pages/Cookies.tsx`** — Política de Cookies (Documento 3 de 9): 15 seções, tipos de cookies, tecnologias semelhantes, gerenciamento e consequências de desativação.
4. **`src/pages/GPSConsent.tsx`** — Termo de Consentimento para Geolocalização e Rastreamento GPS (Documento 4 de 9): 17 seções, incluindo dados coletados, período de rastreamento, revogação e declaração de consentimento.

## Padronizações

- `updatedAt="13 de Julho de 2026"` no `LegalPageLayout` de cada página.
- Estrutura semântica: `<h2>` para seções numeradas, `<h3>` para subseções (ex.: 3.1, 4.1, cookies de sessão vs persistentes), `<ul class="list-disc pl-6">` para listas.
- Endereços e e-mail (`movaagro@gmail.com`) como blocos formatados, com link `mailto:` no e-mail.
- Uso de tokens semânticos (`text-foreground`, `text-primary`), sem cores hardcoded.

## Fora do escopo

- Nenhuma alteração no `Footer`, rotas ou backend — as 4 páginas já existem e estão linkadas.
- Documentos 5 a 9 (Retenção, etc.) ficam para os próximos turnos quando o texto for enviado.

Confirmas para implementar?
