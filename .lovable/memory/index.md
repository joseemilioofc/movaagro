# Project Memory

## Core
- Language & Currency: Portuguese, MZN (Mozambique Metical).
- Roles: cooperative, transporter, farmer, secondary_admin, admin. No free/farmer signups on public pages.
- Routing: Auth redirects to `/home` (users) or `/admin` (admins).
- Payments: Use +258 87 780 1500 (MOVA AGRO) for all proposals/communications.
- Passwords: Min 8 chars, 1 uppercase, 1 lowercase + real-time visual strength indicator.
- User Creation: Admins must use `create-user` Edge Function to register users without losing session.
- Search Priority: Zambézia is the prioritized province in search/filters.
- Conta demo: apenas dados fictícios/simulados, nunca dados reais.

## Memories
- [Platform roles](mem://business/platform-model) — Role definitions (cooperative, transporter, admin types)
- [Admin permissions](mem://auth/admin-role-permissions) — Detailed capability split between Supreme and Secondary admins
- [User creation architecture](mem://auth/user-creation-architecture) — Edge functions for admin user registration
- [Identity verification](mem://features/identity-verification) — Didit integration workflow, statuses, and expiration rules
- [User activity tracking](mem://features/user-activity-tracking) — Audit logging scope, access rules, and export
- [Public pages](mem://design/public-pages) — Landing page copy, restricted signups, and FAQ
- [Pricing page](mem://features/pricing-page) — Freight calculator, maps, sharing, and history
- [Location search](mem://features/location-search-zambezia-priority) — Zambézia province prioritization logic
- [GPS tracking](mem://features/gps-tracking-system) — Real-time tracking for cargo in transit
- [Admin chat UI](mem://features/admin-chat-highlighting) — Badges and visual styling for admin messages in negotiations
- [Mobile navigation](mem://design/mobile-navigation) — Bottom tabs for auth, slide menu for landing, top nav for desktop
- [Footer navigation](mem://design/footer-navigation) — Legal links and hidden admin access
- [About us](mem://design/about-us-content) — Core team members and vision
- [Fleet companies](mem://features/fleet-companies) — Empresa transportadora com gestão de viaturas, motoristas e KPIs
- [Conta demo e perfis duplos](mem://features/demo-account) — Dados fictícios obrigatórios, banner MODO DEMO, auto-activação de papéis
