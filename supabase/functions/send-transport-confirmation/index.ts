import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransportConfirmationRequest {
  email: string;
  name?: string;
  productType?: string;
  quantity?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate?: string;
  urgency?: string;
  type?: "created" | "accepted";
  transporterName?: string;
  transporterEmail?: string;
  requestDetails?: {
    title: string;
    origin: string;
    destination: string;
    cargoType: string;
    weight: number | null;
    pickupDate: string;
    description: string | null;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-transport-confirmation");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: TransportConfirmationRequest = await req.json();
    console.log("Request data:", { ...data, email: data.email ? "***" : "missing" });

    let emailHtml: string;
    let subject: string;

    if (data.type === "accepted" && data.requestDetails) {
      // Email for when a transporter accepts the request
      subject = "🎉 Seu Pedido de Transporte foi Aceito! - MOVA";
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .success-box { background: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 12px; text-align: center; }
            .success-box h2 { color: #16a34a; margin: 0 0 10px 0; }
            .info-card { background: #f9fafb; border-left: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #6b7280; font-size: 14px; }
            .value { color: #111827; font-weight: 600; }
            .transporter-card { background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: 20px; border-radius: 12px; margin: 20px 0; }
            .transporter-card h3 { margin: 0 0 15px 0; color: #065f46; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
            .cta-button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚛 MOVA</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Boas Notícias!</p>
            </div>
            <div class="content">
              <div class="success-box">
                <h2>✅ Pedido Aceito!</h2>
                <p>Um transportador aceitou o seu pedido de transporte.</p>
              </div>
              
              <div class="transporter-card">
                <h3>🚚 Transportador Atribuído</h3>
                <div class="info-row">
                  <span class="label">Nome</span>
                  <span class="value">${data.transporterName || "N/A"}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email</span>
                  <span class="value">${data.transporterEmail || "N/A"}</span>
                </div>
              </div>

              <h3>📦 Detalhes do Pedido</h3>
              <div class="info-card">
                <div class="info-row">
                  <span class="label">Título</span>
                  <span class="value">${data.requestDetails.title}</span>
                </div>
                <div class="info-row">
                  <span class="label">Origem</span>
                  <span class="value">${data.requestDetails.origin}</span>
                </div>
                <div class="info-row">
                  <span class="label">Destino</span>
                  <span class="value">${data.requestDetails.destination}</span>
                </div>
                <div class="info-row">
                  <span class="label">Tipo de Carga</span>
                  <span class="value">${data.requestDetails.cargoType}</span>
                </div>
                ${data.requestDetails.weight ? `
                <div class="info-row">
                  <span class="label">Peso</span>
                  <span class="value">${data.requestDetails.weight} kg</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="label">Data de Recolha</span>
                  <span class="value">${new Date(data.requestDetails.pickupDate).toLocaleDateString("pt-PT")}</span>
                </div>
                ${data.requestDetails.description ? `
                <div class="info-row">
                  <span class="label">Descrição</span>
                  <span class="value">${data.requestDetails.description}</span>
                </div>
                ` : ''}
              </div>
              
              <p style="text-align: center;">
                <strong>Acesse a plataforma para iniciar a conversa com o transportador!</strong>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Original email for when a request is created
      const urgencyLabels: Record<string, string> = {
        baixa: "Baixa",
        media: "Média",
        alta: "Alta",
      };

      subject = "Confirmação do Pedido de Transporte - MOVA";
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px; }
            .info-card { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #6b7280; font-size: 14px; }
            .value { color: #111827; font-weight: 600; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .badge-alta { background: #fef2f2; color: #dc2626; }
            .badge-media { background: #fef3c7; color: #d97706; }
            .badge-baixa { background: #f0fdf4; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚛 MOVA</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Pedido de Transporte Confirmado!</p>
            </div>
            <div class="content">
              <p>Olá <strong>${data.name}</strong>,</p>
              <p>O seu pedido de transporte foi criado com sucesso! Abaixo estão os detalhes:</p>
              
              <div class="info-card">
                <div class="info-row">
                  <span class="label">Produto</span>
                  <span class="value">${data.productType}</span>
                </div>
                <div class="info-row">
                  <span class="label">Quantidade</span>
                  <span class="value">${data.quantity}</span>
                </div>
                <div class="info-row">
                  <span class="label">Origem</span>
                  <span class="value">${data.pickupLocation}</span>
                </div>
                <div class="info-row">
                  <span class="label">Destino</span>
                  <span class="value">${data.deliveryLocation}</span>
                </div>
                <div class="info-row">
                  <span class="label">Data de Recolha</span>
                  <span class="value">${new Date(data.pickupDate!).toLocaleDateString("pt-PT")}</span>
                </div>
                <div class="info-row">
                  <span class="label">Urgência</span>
                  <span class="value">
                    <span class="badge badge-${data.urgency}">${urgencyLabels[data.urgency!] || data.urgency}</span>
                  </span>
                </div>
              </div>
              
              <p>A nossa equipa irá processar o seu pedido e em breve uma transportadora entrará em contacto consigo.</p>
              <p>Se tiver alguma dúvida, não hesite em contactar-nos.</p>
            </div>
            <div class="footer">
              <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "MOVA <onboarding@resend.dev>",
      to: [data.email],
      subject: subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
