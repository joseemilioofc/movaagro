import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email?: string;
  name?: string;
  productType?: string;
  quantity?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate?: string;
  urgency?: string;
  type?: "created" | "accepted" | "proposal_sent" | "payment_submitted" | "payment_confirmed" | "new_request" | "user_registered";
  userName?: string;
  userEmail?: string;
  userRole?: string;
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
  proposalId?: string;
  requestId?: string;
  transporterId?: string;
  price?: number;
  description?: string;
}

const getEmailStyles = () => `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; }
  .header h1 { margin: 0; font-size: 28px; }
  .content { padding: 30px; }
  .info-card { background: #f9fafb; border-left: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  .info-row:last-child { border-bottom: none; }
  .label { color: #6b7280; font-size: 14px; }
  .value { color: #111827; font-weight: 600; }
  .highlight-box { background: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 12px; text-align: center; }
  .price { font-size: 32px; font-weight: bold; color: #16a34a; }
  .payment-box { background: #fef3c7; border: 2px solid #d97706; padding: 20px; margin: 20px 0; border-radius: 12px; }
  .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-transport-confirmation");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log("Request type:", data.type);

    let emailHtml: string;
    let subject: string;
    let recipients: string[] = [];

    // Helper to get profile
    const getProfile = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("user_id", userId)
        .single();
      return profile;
    };

    // Helper to get request details
    const getRequestDetails = async (requestId: string) => {
      const { data: request } = await supabase
        .from("transport_requests")
        .select("*, cooperative_id, transporter_id")
        .eq("id", requestId)
        .single();
      return request;
    };

    // Helper to get admin emails
    const getAdminEmails = async () => {
      const { data: adminRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      
      if (!adminRoles) return [];
      
      const emails: string[] = [];
      for (const admin of adminRoles) {
        const profile = await getProfile(admin.user_id);
        if (profile?.email) emails.push(profile.email);
      }
      return emails;
    };

    // Helper to get all transporter emails
    const getTransporterEmails = async () => {
      const { data: transporterRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "transporter");
      
      if (!transporterRoles) return [];
      
      const emails: string[] = [];
      for (const transporter of transporterRoles) {
        const profile = await getProfile(transporter.user_id);
        if (profile?.email) emails.push(profile.email);
      }
      return emails;
    };

    switch (data.type) {
      case "new_request": {
        // New transport request created - notify all transporters
        const transporterEmails = await getTransporterEmails();
        
        if (transporterEmails.length === 0) {
          console.log("No transporters found to notify");
          return new Response(JSON.stringify({ success: true, message: "No transporters to notify" }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        recipients = transporterEmails;
        subject = "🚛 Novo Pedido de Transporte Disponível - MOVA";

        const urgencyLabels: Record<string, string> = {
          baixa: "Baixa",
          media: "Média",
          alta: "Alta",
        };

        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Nova Oportunidade de Trabalho!</p>
              </div>
              <div class="content">
                <div class="highlight-box">
                  <h2 style="margin: 0 0 10px 0; color: #16a34a;">📦 Novo Pedido de Transporte</h2>
                  <p>Uma cooperativa acaba de criar um novo pedido de transporte. Seja o primeiro a enviar sua proposta!</p>
                </div>

                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Produto</span>
                    <span class="value">${data.productType || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Quantidade</span>
                    <span class="value">${data.quantity || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Origem</span>
                    <span class="value">${data.pickupLocation || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Destino</span>
                    <span class="value">${data.deliveryLocation || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Data de Recolha</span>
                    <span class="value">${data.pickupDate ? new Date(data.pickupDate).toLocaleDateString("pt-PT") : "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Urgência</span>
                    <span class="value" style="color: ${data.urgency === 'alta' ? '#dc2626' : data.urgency === 'media' ? '#d97706' : '#16a34a'}; font-weight: bold;">
                      ${urgencyLabels[data.urgency!] || data.urgency || "N/A"}
                    </span>
                  </div>
                </div>

                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; text-align: center; margin-top: 20px;">
                  <p style="margin: 0; font-size: 16px; color: #065f46;">
                    💰 Acesse a plataforma MOVA para enviar sua proposta e conseguir este trabalho!
                  </p>
                </div>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
                <p style="font-size: 10px; color: #9ca3af;">Você recebeu este email porque está cadastrado como transportador na plataforma MOVA.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "proposal_sent": {
        // Transporter sent a proposal - notify cooperative and admins
        const request = await getRequestDetails(data.requestId!);
        const transporterProfile = await getProfile(data.transporterId!);
        const cooperativeProfile = await getProfile(request.cooperative_id);
        const adminEmails = await getAdminEmails();

        recipients = [cooperativeProfile?.email, ...adminEmails].filter(Boolean) as string[];
        subject = "💰 Nova Proposta de Transporte Recebida - MOVA";

        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Nova Proposta Recebida!</p>
              </div>
              <div class="content">
                <div class="highlight-box">
                  <h2 style="margin: 0 0 10px 0; color: #16a34a;">Nova Proposta de Trabalho</h2>
                  <p>O transportador <strong>${transporterProfile?.name || "N/A"}</strong> enviou uma proposta.</p>
                </div>

                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Pedido</span>
                    <span class="value">${request.title}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Descrição do Serviço</span>
                    <span class="value">${data.description}</span>
                  </div>
                </div>

                <div class="highlight-box">
                  <p style="margin: 0; color: #6b7280;">Valor Proposto:</p>
                  <p class="price">${data.price?.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}</p>
                </div>

                <div class="payment-box">
                  <p style="margin: 0 0 10px 0; font-weight: bold; color: #92400e;">📱 Dados para Pagamento (MOVA):</p>
                  <p style="font-family: monospace; font-size: 18px; margin: 0; color: #78350f;">863343229 J*** P**** E*****</p>
                </div>

                <p style="text-align: center;">
                  <strong>Acesse a plataforma para ver mais detalhes e efetuar o pagamento!</strong>
                </p>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "payment_submitted": {
        // Cooperative submitted payment proof - notify admin and transporter
        const { data: proposal } = await supabase
          .from("transport_proposals")
          .select("*")
          .eq("id", data.proposalId)
          .single();

        const request = await getRequestDetails(data.requestId!);
        const transporterProfile = await getProfile(proposal.transporter_id);
        const cooperativeProfile = await getProfile(request.cooperative_id);
        const adminEmails = await getAdminEmails();

        recipients = [transporterProfile?.email, ...adminEmails].filter(Boolean) as string[];
        subject = "📋 Comprovativo de Pagamento Enviado - MOVA";

        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #d97706, #f59e0b);">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Pagamento Enviado!</p>
              </div>
              <div class="content">
                <div class="highlight-box" style="border-color: #d97706; background: #fef3c7;">
                  <h2 style="margin: 0 0 10px 0; color: #92400e;">📋 Comprovativo Recebido</h2>
                  <p>A cooperativa <strong>${cooperativeProfile?.name || "N/A"}</strong> enviou o comprovativo de pagamento.</p>
                </div>

                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Pedido</span>
                    <span class="value">${request.title}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Valor</span>
                    <span class="value">${proposal.price?.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}</span>
                  </div>
                  ${proposal.payment_code ? `
                  <div class="info-row">
                    <span class="label">Código de Confirmação</span>
                    <span class="value" style="font-family: monospace;">${proposal.payment_code}</span>
                  </div>
                  ` : ''}
                </div>

                <p style="text-align: center; color: #92400e; font-weight: bold;">
                  ⏳ Aguardando confirmação do administrador
                </p>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "payment_confirmed": {
        // Admin confirmed payment - notify transporter and cooperative
        const { data: proposal } = await supabase
          .from("transport_proposals")
          .select("*")
          .eq("id", data.proposalId)
          .single();

        const request = await getRequestDetails(data.requestId!);
        const transporterProfile = await getProfile(proposal.transporter_id);
        const cooperativeProfile = await getProfile(request.cooperative_id);

        recipients = [transporterProfile?.email, cooperativeProfile?.email].filter(Boolean) as string[];
        subject = "✅ Pagamento Confirmado - Transporte Autorizado! - MOVA";

        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #059669, #10b981);">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Transporte Autorizado!</p>
              </div>
              <div class="content">
                <div class="highlight-box" style="border-color: #059669;">
                  <h2 style="margin: 0 0 10px 0; color: #059669;">✅ Pagamento Confirmado!</h2>
                  <p>O administrador confirmou o pagamento. O transporte está autorizado a ser realizado.</p>
                </div>

                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Pedido</span>
                    <span class="value">${request.title}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Origem</span>
                    <span class="value">${request.origin_address}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Destino</span>
                    <span class="value">${request.destination_address}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Data de Coleta</span>
                    <span class="value">${new Date(request.pickup_date).toLocaleDateString("pt-PT")}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Valor Pago</span>
                    <span class="value" style="color: #059669;">${proposal.price?.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}</span>
                  </div>
                </div>

                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; text-align: center; margin-top: 20px;">
                  <p style="margin: 0; font-size: 18px; color: #065f46;">
                    🎉 O transporte pode ser realizado!
                  </p>
                </div>

                <div style="margin-top: 20px;">
                  <p><strong>Transportador:</strong> ${transporterProfile?.name}</p>
                  <p><strong>Cooperativa:</strong> ${cooperativeProfile?.name}</p>
                </div>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "user_registered": {
        // New user registered - notify admins
        const adminEmails = await getAdminEmails();
        
        if (adminEmails.length === 0) {
          console.log("No admins found to notify");
          return new Response(JSON.stringify({ success: true, message: "No admins to notify" }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const roleLabels: Record<string, string> = {
          cooperative: "Cooperativa",
          transporter: "Transportadora",
          admin: "Administrador",
        };

        recipients = adminEmails;
        subject = "👤 Novo Usuário Cadastrado - MOVA";

        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Novo Cadastro na Plataforma!</p>
              </div>
              <div class="content">
                <div class="highlight-box" style="border-color: #3b82f6; background: #eff6ff;">
                  <h2 style="margin: 0 0 10px 0; color: #1d4ed8;">👤 Novo Usuário</h2>
                  <p>Um novo usuário acabou de se cadastrar na plataforma MOVA.</p>
                </div>

                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Nome</span>
                    <span class="value">${data.userName || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">${data.userEmail || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Tipo de Conta</span>
                    <span class="value">${roleLabels[data.userRole!] || data.userRole}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Data de Cadastro</span>
                    <span class="value">${new Date().toLocaleDateString("pt-PT")} às ${new Date().toLocaleTimeString("pt-PT")}</span>
                  </div>
                </div>

                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; text-align: center; margin-top: 20px;">
                  <p style="margin: 0; font-size: 16px; color: #065f46;">
                    📊 Acesse o painel administrativo para gerenciar os usuários.
                  </p>
                </div>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
                <p style="font-size: 10px; color: #9ca3af;">Você recebeu este email porque é administrador da plataforma MOVA.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      case "accepted": {
        // Original accepted email
        subject = "🎉 Seu Pedido de Transporte foi Aceito! - MOVA";
        recipients = [data.email!];
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Boas Notícias!</p>
              </div>
              <div class="content">
                <div class="highlight-box">
                  <h2 style="color: #16a34a; margin: 0 0 10px 0;">✅ Pedido Aceito!</h2>
                  <p>Um transportador aceitou o seu pedido de transporte.</p>
                </div>
                
                <div class="info-card">
                  <div class="info-row">
                    <span class="label">Transportador</span>
                    <span class="value">${data.transporterName || "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">${data.transporterEmail || "N/A"}</span>
                  </div>
                </div>

                ${data.requestDetails ? `
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
                </div>
                ` : ''}
                
                <p style="text-align: center;">
                  <strong>Acesse a plataforma para iniciar a conversa com o transportador!</strong>
                </p>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;
      }

      default: {
        // Original created email
        const urgencyLabels: Record<string, string> = {
          baixa: "Baixa",
          media: "Média",
          alta: "Alta",
        };

        subject = "Confirmação do Pedido de Transporte - MOVA";
        recipients = [data.email!];
        emailHtml = `
          <!DOCTYPE html>
          <html>
          <head><style>${getEmailStyles()}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚛 MOVA</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Pedido de Transporte Confirmado!</p>
              </div>
              <div class="content">
                <p>Olá <strong>${data.name}</strong>,</p>
                <p>O seu pedido de transporte foi criado com sucesso!</p>
                
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
                    <span class="value">${data.pickupDate ? new Date(data.pickupDate).toLocaleDateString("pt-PT") : "N/A"}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Urgência</span>
                    <span class="value">${urgencyLabels[data.urgency!] || data.urgency}</span>
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>© 2024 MOVA - Plataforma de Transporte Agrícola</p>
              </div>
            </div>
          </body>
          </html>
        `;
      }
    }

    // Send emails
    for (const recipient of recipients) {
      try {
        const emailResponse = await resend.emails.send({
          from: "MOVA <onboarding@resend.dev>",
          to: [recipient],
          subject: subject,
          html: emailHtml,
        });
        console.log(`Email sent to ${recipient}:`, emailResponse);
      } catch (emailError) {
        console.error(`Failed to send email to ${recipient}:`, emailError);
      }
    }

    return new Response(JSON.stringify({ success: true, recipients }), {
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