import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, unauthenticated, errorResult, jsonResult } from "../supabase";

export default defineTool({
  name: "create_transport_request",
  title: "Criar pedido de transporte",
  description:
    "Cria um novo pedido de transporte para a cooperativa autenticada.",
  inputSchema: {
    title: z.string().describe("Título curto do pedido."),
    cargo_type: z.string().describe("Tipo de carga, ex: milho, arroz, castanha de caju."),
    origin_address: z.string().describe("Endereço de origem (distrito/província)."),
    destination_address: z.string().describe("Endereço de destino."),
    pickup_date: z.string().describe("Data de recolha no formato YYYY-MM-DD."),
    weight_kg: z.number().optional().describe("Peso da carga em quilogramas."),
    description: z.string().optional().describe("Detalhes adicionais do pedido."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("transport_requests")
      .insert({ ...input, cooperative_id: ctx.getUserId()!, status: "pending" })
      .select()
      .single();
    if (error) return errorResult(error.message);
    return jsonResult(data);
  },
});
