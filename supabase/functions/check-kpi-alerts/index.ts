import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface KPIData {
  name: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { kpiData, adminEmails } = await req.json() as { kpiData: KPIData[]; adminEmails: string[] };

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get alert settings
    const { data: alertSettings, error: alertError } = await supabaseAdmin
      .from("kpi_alerts")
      .select("*");

    if (alertError) throw alertError;

    const alertsToSend: KPIData[] = [];

    for (const kpi of kpiData) {
      const alertSetting = alertSettings?.find((a) => a.kpi_name === kpi.name);
      
      if (alertSetting && alertSetting.email_alert) {
        const threshold = alertSetting.threshold_percentage || 50;
        
        if (kpi.percentage < threshold) {
          // Check if we already sent an alert in the last 24 hours
          const lastAlert = alertSetting.last_alert_sent_at;
          const now = new Date();
          
          if (!lastAlert || (now.getTime() - new Date(lastAlert).getTime()) > 24 * 60 * 60 * 1000) {
            alertsToSend.push(kpi);
            
            // Update last alert time
            await supabaseAdmin
              .from("kpi_alerts")
              .update({ last_alert_sent_at: now.toISOString() })
              .eq("kpi_name", kpi.name);
          }
        }
      }
    }

    if (alertsToSend.length > 0 && adminEmails.length > 0) {
      const formatValue = (value: number, unit: string) => {
        if (unit === "MZN") {
          return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(value);
        }
        if (unit === "%") {
          return `${value}%`;
        }
        return value.toLocaleString("pt-MZ");
      };

      const kpiLabels: Record<string, string> = {
        new_users: "Novos Usuários",
        monthly_requests: "Pedidos do Mês",
        conversion_rate: "Taxa de Conversão",
        monthly_revenue: "Receita Mensal",
      };

      const alertsHtml = alertsToSend
        .map(
          (kpi) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${kpiLabels[kpi.name] || kpi.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatValue(kpi.current, kpi.unit)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatValue(kpi.target, kpi.unit)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #dc2626; font-weight: bold;">${kpi.percentage}%</td>
          </tr>
        `
        )
        .join("");

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">⚠️ Alerta de KPIs</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb; border-radius: 0 0 8px 8px;">
            <p style="color: #374151;">Os seguintes KPIs estão abaixo da meta estabelecida:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #e5e7eb;">
                  <th style="padding: 12px; text-align: left;">KPI</th>
                  <th style="padding: 12px; text-align: left;">Atual</th>
                  <th style="padding: 12px; text-align: left;">Meta</th>
                  <th style="padding: 12px; text-align: left;">Progresso</th>
                </tr>
              </thead>
              <tbody>
                ${alertsHtml}
              </tbody>
            </table>
            <p style="color: #6b7280; font-size: 14px;">
              Este alerta é enviado automaticamente quando os KPIs ficam abaixo do limite configurado.
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: "Alertas TransCoop <onboarding@resend.dev>",
        to: adminEmails,
        subject: `⚠️ Alerta: ${alertsToSend.length} KPI(s) abaixo da meta`,
        html: emailHtml,
      });

      console.log(`Sent KPI alert email to ${adminEmails.length} admin(s) for ${alertsToSend.length} KPI(s)`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        alertsSent: alertsToSend.length,
        kpisChecked: kpiData.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error checking KPI alerts:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
