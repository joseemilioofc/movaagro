# MOVA AGRO - Documentação Técnica Completa

**Versão:** 1.0  
**Data:** Janeiro 2025  
**Plataforma:** Lovable Cloud  

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estrutura do Projeto](#4-estrutura-do-projeto)
5. [Base de Dados](#5-base-de-dados)
6. [Autenticação e Autorização](#6-autenticação-e-autorização)
7. [Funcionalidades Principais](#7-funcionalidades-principais)
8. [Edge Functions](#8-edge-functions)
9. [Componentes UI](#9-componentes-ui)
10. [Hooks Personalizados](#10-hooks-personalizados)
11. [Integrações](#11-integrações)
12. [PWA](#12-pwa)
13. [Segurança](#13-segurança)
14. [Histórico de Desenvolvimento](#14-histórico-de-desenvolvimento)

---

## 1. Visão Geral

### 1.1 Descrição do Projeto

A **MOVA AGRO** é uma plataforma digital moçambicana que conecta cooperativas agrícolas, agricultores e transportadores. O sistema facilita a logística de transporte de produtos agrícolas em Moçambique, oferecendo:

- Calculadora de preços de transporte
- Sistema de pedidos e propostas
- Contratos digitais com assinatura
- Rastreamento GPS em tempo real
- Chat integrado
- Sistema de avaliações

### 1.2 Público-Alvo

| Tipo de Utilizador | Função |
|-------------------|--------|
| **Cooperativa** | Cria pedidos de transporte, aceita propostas, assina contratos |
| **Transportador** | Visualiza pedidos, envia propostas, executa transportes |
| **Administrador** | Gere toda a plataforma, utilizadores e métricas |

### 1.3 Idioma e Moeda

- **Idioma:** Português (variante brasileira/moçambicana)
- **Moeda:** Metical Moçambicano (MZN)
- **Formato:** `XX.XXX,XX MZN`

---

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Pages     │  │  Components │  │        Hooks            │ │
│  │  - Home     │  │  - UI       │  │  - useGPSTracking       │ │
│  │  - Auth     │  │  - Admin    │  │  - useNotifications     │ │
│  │  - Pricing  │  │  - Forms    │  │  - useContracts         │ │
│  │  - Dash...  │  │  - Maps     │  │  - useAuditLog          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LOVABLE CLOUD (Supabase)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Database   │  │    Auth     │  │    Edge Functions       │ │
│  │  PostgreSQL │  │  Email/JWT  │  │  - send-welcome-email   │ │
│  │  14 Tables  │  │  3 Roles    │  │  - check-kpi-alerts     │ │
│  │  RLS        │  │             │  │  - create-admin-user    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  Storage    │  │  Realtime   │                              │
│  │  Buckets    │  │  WebSocket  │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo de Dados

```
Utilizador → React App → Supabase Client → PostgreSQL
                ↓                              ↓
           AuthContext                    RLS Policies
                ↓                              ↓
           Protected Routes            Data Filtering
```

---

## 3. Stack Tecnológico

### 3.1 Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 18.3.1 | Framework UI |
| TypeScript | - | Tipagem estática |
| Vite | - | Build tool |
| Tailwind CSS | - | Estilização |
| shadcn/ui | - | Componentes UI |
| React Router | 6.30.1 | Navegação |
| TanStack Query | 5.83.0 | Cache e fetching |
| React Hook Form | 7.61.1 | Formulários |
| Zod | 3.25.76 | Validação |

### 3.2 Backend (Lovable Cloud)

| Serviço | Propósito |
|---------|-----------|
| PostgreSQL | Base de dados |
| Auth | Autenticação |
| Edge Functions | Lógica serverless |
| Storage | Armazenamento de ficheiros |
| Realtime | WebSocket subscriptions |

### 3.3 Bibliotecas Adicionais

| Biblioteca | Propósito |
|------------|-----------|
| mapbox-gl | Mapas interativos |
| recharts | Gráficos e visualizações |
| jspdf + jspdf-autotable | Exportação PDF |
| xlsx | Exportação Excel |
| date-fns | Manipulação de datas |
| lucide-react | Ícones |
| sonner | Notificações toast |
| framer-motion | Animações |

---

## 4. Estrutura do Projeto

```
mova-agro/
├── docs/
│   └── TECHNICAL_DOCUMENTATION.md
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── pwa-*.png              # Ícones PWA
│   └── robots.txt
├── src/
│   ├── assets/                # Imagens estáticas
│   ├── components/
│   │   ├── admin/             # Componentes admin
│   │   └── ui/                # Componentes shadcn
│   ├── contexts/
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── data/
│   │   └── mozambiqueLocations.ts  # Dados geográficos
│   ├── hooks/                 # Hooks personalizados
│   ├── integrations/
│   │   └── supabase/          # Cliente e tipos
│   ├── lib/                   # Utilitários
│   ├── pages/                 # Páginas da aplicação
│   ├── App.tsx                # Componente raiz
│   ├── index.css              # Estilos globais
│   └── main.tsx               # Entry point
├── supabase/
│   ├── config.toml            # Configuração
│   └── functions/             # Edge Functions
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 5. Base de Dados

### 5.1 Diagrama ER (Entity-Relationship)

```
┌──────────────────┐      ┌──────────────────┐
│     profiles     │      │    user_roles    │
├──────────────────┤      ├──────────────────┤
│ id (PK)          │      │ id (PK)          │
│ user_id (FK)     │◄────►│ user_id          │
│ name             │      │ role (enum)      │
│ email            │      └──────────────────┘
│ phone            │
│ company_name     │
└──────────────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────┐
│transport_requests│      │transport_proposals│
├──────────────────┤      ├──────────────────┤
│ id (PK)          │◄────►│ id (PK)          │
│ cooperative_id   │      │ transport_req_id │
│ transporter_id   │      │ transporter_id   │
│ title            │      │ price            │
│ origin_address   │      │ description      │
│ destination_addr │      │ status           │
│ cargo_type       │      │ payment_proof_url│
│ weight_kg        │      │ mova_account     │
│ pickup_date      │      └──────────────────┘
│ status           │               │
└──────────────────┘               ▼
         │              ┌──────────────────┐
         │              │digital_contracts │
         ▼              ├──────────────────┤
┌──────────────────┐    │ id (PK)          │
│  chat_messages   │    │ proposal_id (FK) │
├──────────────────┤    │ transport_req_id │
│ id (PK)          │    │ contract_number  │
│ transport_req_id │    │ terms            │
│ sender_id        │    │ signatures       │
│ message          │    │ status           │
│ created_at       │    └──────────────────┘
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│transport_locations│   │     ratings      │
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ transport_req_id │    │ transport_req_id │
│ transporter_id   │    │ reviewer_id      │
│ latitude         │    │ reviewed_id      │
│ longitude        │    │ rating (1-5)     │
│ speed            │    │ comment          │
│ heading          │    └──────────────────┘
│ accuracy         │
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│price_calculations│    │   price_alerts   │
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ user_id          │    │ user_id          │
│ origin           │    │ origin           │
│ destination      │    │ destination      │
│ cargo_type       │    │ cargo_type       │
│ weight_kg        │    │ base_price       │
│ distance_km      │    │ threshold_%      │
│ price_min/max    │    │ is_active        │
└──────────────────┘    └──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│   audit_logs     │    │    kpi_goals     │
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ user_id          │    │ name             │
│ action           │    │ target_value     │
│ entity_type      │    │ unit             │
│ entity_id        │    │ description      │
│ details (JSON)   │    └──────────────────┘
│ ip_address       │
└──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│   kpi_alerts     │    │  alert_history   │
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ kpi_name         │    │ alert_type       │
│ threshold_%      │    │ kpi_names[]      │
│ email_alert      │    │ recipients[]     │
│ last_alert_at    │    │ details (JSON)   │
└──────────────────┘    └──────────────────┘

┌────────────────────────┐
│transporter_availability│
├────────────────────────┤
│ id (PK)                │
│ transporter_id         │
│ date                   │
│ is_available           │
│ max_capacity_kg        │
│ notes                  │
└────────────────────────┘
```

### 5.2 Enums

```sql
CREATE TYPE app_role AS ENUM ('admin', 'cooperative', 'transporter');
```

### 5.3 Tabelas Detalhadas

#### profiles
| Coluna | Tipo | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| name | text | No | - |
| email | text | No | - |
| phone | text | Yes | - |
| company_name | text | Yes | - |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

#### transport_requests
| Coluna | Tipo | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| cooperative_id | uuid | No | - |
| transporter_id | uuid | Yes | - |
| title | text | No | - |
| description | text | Yes | - |
| origin_address | text | No | - |
| destination_address | text | No | - |
| cargo_type | text | No | - |
| weight_kg | numeric | Yes | - |
| pickup_date | date | No | - |
| status | text | Yes | 'pending' |
| external_form_link | text | Yes | - |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

**Status possíveis:** `pending`, `accepted`, `in_progress`, `completed`, `cancelled`

---

## 6. Autenticação e Autorização

### 6.1 Sistema de Roles

```typescript
type AppRole = 'admin' | 'cooperative' | 'transporter';
```

### 6.2 Fluxo de Registo

```
1. Utilizador submete formulário de registo
2. Supabase Auth cria entrada em auth.users
3. Trigger handle_new_user() é acionado
4. Cria perfil em public.profiles
5. Cria role em public.user_roles
6. Email de boas-vindas é enviado (opcional)
```

### 6.3 Função de Verificação de Role

```sql
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### 6.4 Row Level Security (RLS)

Todas as tabelas têm RLS ativado. Exemplo de políticas:

```sql
-- Cooperativas vêem apenas os próprios pedidos
CREATE POLICY "Cooperatives can view own requests"
ON transport_requests FOR SELECT
USING (auth.uid() = cooperative_id);

-- Admins vêem tudo
CREATE POLICY "Admins can manage all requests"
ON transport_requests FOR ALL
USING (has_role(auth.uid(), 'admin'));
```

---

## 7. Funcionalidades Principais

### 7.1 Calculadora de Preços

**Localização:** `src/pages/Pricing.tsx`

**Algoritmo de Cálculo:**
```typescript
// Taxas base por tipo de carga (MZN/km/ton)
const rates = {
  cereais: 35,
  legumes: 40,
  frutas: 45,
  fertilizantes: 30,
  outros: 38
};

// Fórmula
const basePrice = distance * (weight / 1000) * rate;
const minPrice = basePrice * 0.9;
const maxPrice = basePrice * 1.1;
```

**Funcionalidades:**
- Seleção de origem/destino (158 localidades)
- Tipos de carga predefinidos
- Histórico de cálculos (utilizadores autenticados)
- Comparação de preços por gráfico
- Exportação PDF
- Partilha via WhatsApp/Email
- Alertas de preço
- Rotas populares

### 7.2 Sistema de Transportes

**Fluxo Completo:**

```
┌─────────────────┐
│ Cooperativa cria│
│    pedido       │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Transportadores │
│ vêem e propõem  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Cooperativa     │
│ aceita proposta │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Contrato digital│
│   gerado        │
└────────┬────────┘
         ▼
┌─────────────────┐
│   Assinaturas   │
│ (ambas partes)  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Pagamento       │
│ (M-Pesa/upload) │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Admin confirma  │
│   pagamento     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Transporte      │
│ inicia (GPS)    │
└────────┬────────┘
         ▼
┌─────────────────┐
│   Conclusão     │
│  + Avaliação    │
└─────────────────┘
```

### 7.3 Rastreamento GPS

**Hook:** `src/hooks/useGPSTracking.ts`

**Funcionalidades:**
- Captura de localização via Geolocation API
- Atualização em tempo real via Supabase Realtime
- Histórico de localizações
- Velocidade e direção
- Visualização em mapa (Mapbox)

### 7.4 Chat Integrado

**Componente:** `src/components/TransportChat.tsx`

- Mensagens em tempo real
- Vinculado ao pedido de transporte
- Visível para cooperativa e transportador aceite
- Admins podem visualizar todos

### 7.5 Contratos Digitais

**Componente:** `src/components/DigitalContract.tsx`

- Geração automática de número de contrato
- Termos e condições
- Assinatura digital (canvas)
- PDF exportável
- Status: `pending`, `signed`, `completed`

---

## 8. Edge Functions

### 8.1 send-welcome-email

**Caminho:** `supabase/functions/send-welcome-email/index.ts`

```typescript
// Envia email de boas-vindas usando Resend
POST /functions/v1/send-welcome-email
Body: { email, name }
```

### 8.2 check-kpi-alerts

**Caminho:** `supabase/functions/check-kpi-alerts/index.ts`

```typescript
// Verifica KPIs e envia alertas se abaixo do threshold
POST /functions/v1/check-kpi-alerts
// Executado via cron ou manualmente
```

### 8.3 create-admin-user

**Caminho:** `supabase/functions/create-admin-user/index.ts`

```typescript
// Cria utilizador admin (uso interno)
POST /functions/v1/create-admin-user
Body: { email, password, name }
```

### 8.4 create-demo-user

**Caminho:** `supabase/functions/create-demo-user/index.ts`

```typescript
// Cria utilizador demo para testes
POST /functions/v1/create-demo-user
```

### 8.5 send-transport-confirmation

**Caminho:** `supabase/functions/send-transport-confirmation/index.ts`

```typescript
// Envia confirmação de transporte aceite
POST /functions/v1/send-transport-confirmation
Body: { transportRequestId, proposalId }
```

---

## 9. Componentes UI

### 9.1 Componentes Personalizados

| Componente | Descrição |
|------------|-----------|
| `CitySearchSelect` | Selector de cidades com busca |
| `DigitalContract` | Visualização e assinatura de contrato |
| `GPSTrackingMap` | Mapa com rastreamento em tempo real |
| `MozambiqueMap` | Mapa SVG de Moçambique |
| `NotificationBell` | Sino de notificações |
| `PriceAlertManager` | Gestão de alertas de preço |
| `PriceComparison` | Comparação de preços |
| `PriceComparisonChart` | Gráfico de comparação |
| `PriceExportPDF` | Exportação de orçamento PDF |
| `PriceHistory` | Histórico de cálculos |
| `ProposalCard` | Card de proposta |
| `ProposalForm` | Formulário de proposta |
| `RatingDialog` | Diálogo de avaliação |
| `RatingDisplay` | Exibição de estrelas |
| `ShareQuoteButtons` | Botões de partilha |
| `TransportChat` | Chat de transporte |
| `TransportRequestForm` | Formulário de pedido |
| `TransporterAvailabilityCalendar` | Calendário de disponibilidade |
| `TravelTimeEstimate` | Estimativa de tempo de viagem |

### 9.2 Componentes Admin

| Componente | Descrição |
|------------|-----------|
| `AdvancedAnalyticsDashboard` | Analytics avançados |
| `AuditStatsDashboard` | Estatísticas de auditoria |
| `CreateUserDialog` | Criação de utilizadores |
| `DateRangePicker` | Seletor de período |
| `ExportAuditPDFButton` | Exportar auditoria PDF |
| `ExportExcelButton` | Exportar para Excel |
| `ExportPDFButton` | Exportar para PDF |
| `KPIDashboard` | Dashboard de KPIs |
| `KPIGoalsSettings` | Configuração de metas |
| `MonthlyComparisonChart` | Comparação mensal |

### 9.3 Componentes shadcn/ui

Biblioteca completa instalada incluindo:
- Accordion, Alert, Avatar, Badge
- Button, Card, Calendar, Carousel
- Checkbox, Dialog, Dropdown, Form
- Input, Label, Popover, Progress
- Select, Separator, Sheet, Skeleton
- Slider, Switch, Table, Tabs
- Textarea, Toast, Toggle, Tooltip

---

## 10. Hooks Personalizados

### 10.1 useGPSTracking

```typescript
interface UseGPSTrackingProps {
  transportRequestId: string;
  transporterId?: string;
  isTransporter: boolean;
}

const {
  currentLocation,
  locationHistory,
  isTracking,
  startTracking,
  stopTracking,
  fetchLocationHistory
} = useGPSTracking(props);
```

### 10.2 useNotifications

```typescript
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead
} = useNotifications();
```

### 10.3 useContracts

```typescript
const {
  contracts,
  signContract,
  isLoading
} = useContracts(transportRequestId);
```

### 10.4 useAuditLog

```typescript
const { logAction } = useAuditLog();

// Uso
logAction('create', 'transport_request', requestId, { title });
```

### 10.5 useUserRating

```typescript
const {
  averageRating,
  totalRatings,
  isLoading
} = useUserRating(userId);
```

### 10.6 usePWA

```typescript
const {
  isInstallable,
  isInstalled,
  promptInstall
} = usePWA();
```

### 10.7 useRealtimeNotifications

```typescript
useRealtimeNotifications({
  enabled: true,
  onNewRequest: (request) => { /* ... */ }
});
```

---

## 11. Integrações

### 11.1 Mapbox GL

**Uso:** Mapas interativos para GPS tracking

```typescript
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'MAPBOX_TOKEN';
```

### 11.2 Resend (Email)

**Secret:** `RESEND_API_KEY`

```typescript
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
await resend.emails.send({
  from: 'MOVA AGRO <noreply@movaagro.mz>',
  to: email,
  subject: 'Bem-vindo',
  html: template
});
```

### 11.3 M-Pesa (Pagamentos)

Integração manual via:
1. Upload de comprovante
2. Código de pagamento
3. Confirmação pelo admin

---

## 12. PWA

### 12.1 Configuração

**Ficheiro:** `vite.config.ts`

```typescript
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'MOVA AGRO',
    short_name: 'MOVA',
    theme_color: '#16a34a'
  }
})
```

### 12.2 Manifest

**Ficheiro:** `public/manifest.json`

```json
{
  "name": "MOVA AGRO",
  "short_name": "MOVA",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#16a34a",
  "background_color": "#ffffff"
}
```

### 12.3 Ícones

- `pwa-192x192.png`
- `pwa-512x512.png`
- `pwa-maskable-192x192.png`
- `pwa-maskable-512x512.png`

---

## 13. Segurança

### 13.1 Row Level Security (RLS)

Todas as 14 tabelas têm RLS ativado com políticas específicas por role.

### 13.2 Sanitização de Input

```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

### 13.3 Validação de Dados

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

### 13.4 Secrets Configurados

| Secret | Propósito |
|--------|-----------|
| `SUPABASE_SERVICE_ROLE_KEY` | Operações admin |
| `SUPABASE_ANON_KEY` | Cliente público |
| `RESEND_API_KEY` | Envio de emails |

### 13.5 Storage Buckets

| Bucket | Público | Uso |
|--------|---------|-----|
| `payment-proofs` | Não | Comprovantes de pagamento |

---

## 14. Histórico de Desenvolvimento

### Fase 1 - Fundação
- Configuração React + Vite + TypeScript + Tailwind
- Integração Lovable Cloud
- Estrutura de pastas
- Configuração PWA

### Fase 2 - Autenticação
- Sistema de login/registo
- 3 roles (admin, cooperative, transporter)
- Contexto de autenticação
- Reset de password

### Fase 3 - Páginas Institucionais
- Landing page
- Sobre Nós
- Termos e Privacidade
- Footer e navegação

### Fase 4 - Calculadora de Preços
- Formulário de cálculo
- 158 localidades de Moçambique
- Histórico, comparação, PDF
- Alertas e rotas populares

### Fase 5 - Sistema de Transporte
- CRUD de pedidos
- Sistema de propostas
- Contratos digitais
- Chat e GPS tracking
- Avaliações

### Fase 6 - Dashboards
- Dashboard por role
- KPIs e metas
- Analytics avançados

### Fase 7 - Auditoria
- Sistema de audit logs
- Exportação de relatórios

### Fase 8 - Notificações
- Notificações push
- Realtime notifications
- Edge functions para email

### Fase 9 - Refinamentos
- Mapa de Moçambique
- Estimativa de tempo
- Ranking de transportadores
- Melhorias de UI/UX

---

## Apêndices

### A. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### B. Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xnrckjigfltaaanzfzml.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=xnrckjigfltaaanzfzml
```

### C. Contacto

**Projecto:** MOVA AGRO  
**Plataforma:** Lovable  
**ID do Projecto:** d720908b-12b5-4306-b9d5-ada05f2ca3b1

---

*Documentação gerada em Janeiro 2025*
