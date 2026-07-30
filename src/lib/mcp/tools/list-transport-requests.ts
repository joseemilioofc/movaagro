import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_transport_requests",
  title: "Listar pedidos de transporte",
  description:
    "Lista os pedidos de transporte visíveis para o utilizador autenticado, com filtro opcional por estado.",
  inputSchema: {
    status: z
      .string()
      .optional()
      .describe("Filtrar por estado, ex: pending, accepted, in_transit, completed."),
    limit: z.number().int().optional().describe("Número máximo de resultados (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("transport_requests")
      .select(
        "id,title,cargo_type,weight_kg,origin_address,destination_address,pickup_date,status,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(Math.min(limit ?? 20, 100));
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult(data ?? []);
  },
});
