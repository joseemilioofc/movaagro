import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_proposals",
  title: "Listar propostas",
  description:
    "Lista as propostas de transporte visíveis para o utilizador autenticado, opcionalmente filtradas por pedido.",
  inputSchema: {
    transport_request_id: z.string().optional().describe("ID do pedido de transporte."),
    limit: z.number().int().optional().describe("Número máximo de resultados (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ transport_request_id, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("transport_proposals")
      .select("id,transport_request_id,price,description,status,created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit ?? 20, 100));
    if (transport_request_id) query = query.eq("transport_request_id", transport_request_id);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult(data ?? []);
  },
});
