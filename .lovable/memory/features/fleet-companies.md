---
name: Fleet companies
description: Empresa transportadora com gestão de viaturas, motoristas e KPIs, incluindo checklist documental completo
type: feature
---

# Empresa Transportadora com Frota

Extensão do role `transporter` via flag `is_company` em `transporter_details`. Painel dedicado em `/fleet` com tabs Pedidos / Viaturas / Motoristas / KPIs.

## Checklist documental (Moçambique)

### Empresa (`transporter_details`)
- Alvará/licença de transporte (nº + validade + ficheiro)
- Certidão de registo comercial (nº + ficheiro)
- NUIT da empresa
- Representante legal: nome, cargo, tipo/nº de documento + ficheiro
- Comprovativo de situação fiscal (opcional)
- Seguro de responsabilidade civil (opcional)

### Viatura (`fleet_vehicles`)
- Livrete/DUA (nº + ficheiro)
- Título de propriedade
- Licença de transporte da viatura (nº + validade + ficheiro)
- Inspeção técnica (data + validade + ficheiro)
- Apólice de seguro (seguradora + nº + validade + ficheiro)
- Fotos: principal, frente, lateral, traseira, matrícula
- Declaração de vinculação à transportadora (assinada e carimbada)

### Motorista (`fleet_drivers`)
- Carta de condução (categoria + nº + validade + ficheiro)
- Documento de identificação (tipo + nº + validade + ficheiro)
- Contrato de trabalho ou declaração de autorização
- Contactos: telefone, telefone alt., email, endereço

## Storage
- Bucket privado `fleet-assets` (viaturas e motoristas), prefixo `{user_id}/...`
- Bucket privado `transporter-documents` (empresa), prefixo `{user_id}/company/...`

## UX
- Forms organizados em `Accordion` por secção.
- Badges de alerta na lista de viaturas quando validade < 30 dias ou expirada.
- Componente reutilizável `FileUploadField` para upload + signed URL.
