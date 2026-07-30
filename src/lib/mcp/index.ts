import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listTransportRequests from "./tools/list-transport-requests";
import createTransportRequest from "./tools/create-transport-request";
import listProposals from "./tools/list-proposals";
import listFleetVehicles from "./tools/list-fleet-vehicles";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mova-agro-mcp",
  title: "MOVA AGRO",
  version: "0.1.0",
  instructions:
    "Ferramentas da plataforma MOVA AGRO (logística agrícola em Moçambique). Permite listar e criar pedidos de transporte, consultar propostas e ver as viaturas da frota do utilizador autenticado. Valores monetários em MZN.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listTransportRequests, createTransportRequest, listProposals, listFleetVehicles],
});
