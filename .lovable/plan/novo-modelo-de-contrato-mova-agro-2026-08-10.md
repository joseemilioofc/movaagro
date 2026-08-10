# Novo modelo de contrato MOVA AGRO

Substituição integral do texto jurídico do contrato electrónico, mantendo intactos fluxo, base de dados, permissões e integrações.

## O que muda

1. **Texto do contrato (novo modelo jurídico)**
   - O gerador de termos passa a produzir o "Contrato Electrónico de Intermediação e Prestação de Serviços de Transporte de Carga Agrícola" com exactamente as 19 secções pedidas (Identificação das Partes → Assinaturas).
   - Em vários pontos (Objecto, Responsabilidade, Aceitação) fica explícito que a MOVA AGRO é apenas plataforma tecnológica de intermediação e não é transportadora, operadora logística, seguradora, proprietária da carga ou do veículo, empregadora do motorista nem representante das partes; a execução do transporte é responsabilidade exclusiva do transportador.
   - Identificação da empresa: MOVA AGRO, LDA — Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida Eduardo Mondlane, Moçambique — movaagro@gmail.com. (Nota verificada: já não existe nenhuma ocorrência de "Rua 1115" no projecto; a verificação será repetida.)
   - Contratos antigos continuam guardados e legíveis: o texto fica gravado no registo, portanto só contratos novos usam o modelo novo.

2. **Apresentação do contrato no ecrã**
   - O cartão do contrato passa a mostrar cabeçalho com logo MOVA AGRO, número do contrato, código da viagem, estado e data de emissão, e rodapé com hash, data, hora e número do contrato.
   - Blocos das 19 secções com melhor tipografia e espaçamento.
   - Assinaturas reorganizadas em três blocos: Contratante, Transportador e MOVA AGRO (esta última como interveniente/plataforma, sem alterar a lógica de assinatura existente das duas partes).

3. **PDF / impressão**
   - O botão "Baixar/Imprimir Contrato" mantém-se, com folha A4, margens, quebra automática de páginas, cabeçalho repetido e rodapé com paginação (`Página X de Y`) e hash.
   - O export do histórico de contratos permanece inalterado.

## Detalhes técnicos

- `src/hooks/useContracts.ts`: reescrever apenas `generateTerms` (novo texto, 19 secções). Assinatura da função, colunas gravadas, `createContract`, realtime e numeração ficam iguais.
- `src/components/DigitalContract.tsx`: novo layout de renderização e novo CSS de impressão (`@page A4`, `@media print`, contadores de página via CSS). Mantém `DOMPurify`, `handleSign`, estados e `onUpdate`.
- Campos: são usados os que existem hoje em `digital_contracts` (contract_number, price, pickup_date, origin/destination_address, cargo_type, weight_kg, assinaturas, status). Para campos pedidos que não existem na base — tripCode, NUIT, matrículas, motorista, volume, valor da carga, método de pagamento, contractHash — serão preenchidos a partir dos dados já disponíveis no ecrã/props quando existirem, e caso contrário renderizados como "Não informado". O hash será derivado deterministicamente do conteúdo do contrato no cliente, sem gravar nada.
- Sem migrações, sem alterações a RLS, storage, edge functions ou rotas.
