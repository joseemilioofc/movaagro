
# Plano: Documentação completa (Empresa, Viatura, Motorista)

Vamos estender o painel de **Empresa Transportadora com Frota** para recolher toda a documentação legalmente exigida em Moçambique, em três blocos: empresa, viatura e motorista. Mantém-se o painel do transportador individual como está hoje.

## 1. Documentos da Transportadora (empresa)

Estender `transporter_details` e o formulário `TransporterApprovalForm` (apenas quando `is_company = true`) com:

- Alvará/licença de transporte da empresa (upload + nº + validade)
- Certidão de registo comercial (upload + nº)
- NUIT da empresa (já existe em `company_nuit` — manter)
- Documento de identificação do representante legal (upload + nome + cargo + tipo de doc + nº)
- Comprovativo de situação fiscal regular (upload + validade, opcional)
- Apólice de seguro de responsabilidade civil (upload + seguradora + nº + validade, opcional)

Bucket privado existente `transporter-documents` é reaproveitado, com pasta `{user_id}/company/`.

## 2. Documentos da Viatura

Estender a tabela `fleet_vehicles` e o formulário em `FleetVehiclesManager` com:

- Livrete / DUA (upload + nº)
- Título de propriedade ou prova de posse (upload)
- Licença de transporte da viatura (upload + nº + validade)
- Inspeção técnica (upload + data da última + validade)
- Apólice de seguro (upload + seguradora + nº + validade)
- Fotos da viatura: frontal, lateral, traseira e da matrícula (4 uploads; manter `photo_url` como principal)
- **Declaração de vinculação à transportadora** (upload, com nota de que deve conter matrícula, marca/modelo, proprietário, nome da transportadora e confirmação de autorização sob o alvará)

Alertas visuais quando uma validade está a < 30 dias ou expirada (badge vermelho/amarelo na lista de viaturas).

## 3. Documentos do Motorista

Estender `fleet_drivers` e o formulário em `FleetDriversManager` com:

- Carta de condução (upload + categoria + nº + validade — `license_number` e `license_expiry` já existem; adicionar `license_category` e upload)
- BI / documento de identificação (upload + tipo + nº + validade)
- Contrato de trabalho ou declaração da transportadora autorizando-o a operar (upload)
- Contactos atualizados: telefone (já existe), telefone alternativo, email, endereço

## 4. Aprovação por Admin

Em `/admin/transporter-approvals` o admin passa a ver, para empresas:

- Checklist dos documentos obrigatórios da empresa (com link para abrir cada ficheiro via signed URL)
- Indicadores de validade
- Ações: aprovar / rejeitar com motivo (já existem)

Viaturas e motoristas continuam geridos pela empresa; admins podem inspecionar via página de detalhe da empresa (link "Ver frota").

## 5. UX no formulário

- Cada bloco numa secção colapsável (`Accordion`) para não sobrecarregar a página.
- Marcar campos obrigatórios vs. opcionais (situação fiscal e seguro RC são opcionais).
- Validação client-side: NUIT 9 dígitos, datas de validade no futuro, ficheiros até 10 MB (pdf/jpg/png).
- Após upload, mostrar preview/nome do ficheiro e botão para substituir.

## Detalhes técnicos

**Migração SQL** (alterar tabelas existentes — sem novas tabelas):

`transporter_details` ganha:
`alvara_number`, `alvara_expiry`, `alvara_url`, `commercial_registry_number`, `commercial_registry_url`, `legal_rep_name`, `legal_rep_role`, `legal_rep_doc_type`, `legal_rep_doc_number`, `legal_rep_doc_url`, `tax_clearance_url`, `tax_clearance_expiry`, `civil_insurance_company`, `civil_insurance_number`, `civil_insurance_expiry`, `civil_insurance_url`.

`fleet_vehicles` ganha:
`livrete_number`, `livrete_url`, `ownership_doc_url`, `transport_license_number`, `transport_license_expiry`, `transport_license_url`, `inspection_date`, `inspection_expiry`, `inspection_url`, `insurance_company`, `insurance_number`, `insurance_expiry`, `insurance_url`, `photo_front_url`, `photo_side_url`, `photo_rear_url`, `photo_plate_url`, `binding_declaration_url`.

`fleet_drivers` ganha:
`license_category`, `license_url`, `id_doc_type`, `id_doc_number`, `id_doc_expiry`, `id_doc_url`, `employment_contract_url`, `phone_alt`, `email`, `address`.

Todos os campos novos são `nullable` para não quebrar registos existentes; obrigatoriedade é validada na UI antes de submeter para aprovação.

**Storage**: reutilizar `transporter-documents` (já privado) com prefixos:
- `{user_id}/company/...`
- `{user_id}/vehicles/{vehicle_id}/...`
- `{user_id}/drivers/{driver_id}/...`

Policies existentes já restringem por `owner` (auth.uid).

**Memória**: atualizar `mem://features/fleet-companies` com a checklist completa.

## Fora de escopo

- OCR/extração automática dos documentos.
- Renovação automática de alertas por email (pode entrar numa fase seguinte).
