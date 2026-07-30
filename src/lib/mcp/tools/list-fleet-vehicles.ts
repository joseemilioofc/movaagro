import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "list_fleet_vehicles",
  title: "Listar viaturas da frota",
  description:
    "Lista as viaturas registadas na frota da transportadora autenticada.",
  inputSchema: {
    limit: z.number().int().optional().describe("Número máximo de resultados (padrão 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("fleet_vehicles")
      .select("id,plate,brand,model,vehicle_type,capacity_kg,year,status,created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(limit ?? 50, 100));
    if (error) return errorResult(error.message);
    return jsonResult(data ?? []);
  },
});
