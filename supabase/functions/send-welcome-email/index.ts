import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  role: string;
  password: string;
}

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  cooperative: "Cooperativa",
  transporter: "Transportadora",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, role, password }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} for role ${role}`);

    const roleLabel = roleLabels[role] || role;
    const loginUrl = `${req.headers.get("origin") || "https://movaagro.com"}/auth`;

    const emailResponse = await resend.emails.send({
      from: "MovaAgro <onboarding@resend.dev>",
      to: [email],
      subject: `Bem-vindo ao MovaAgro - Sua conta de ${roleLabel} foi criada!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #225243, #2d6a54); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #225243; }
            .button { display: inline-block; background: #225243; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚛 MovaAgro</h1>
              <p>Plataforma de Transporte Agrícola</p>
            </div>
            <div class="content">
              <h2>Olá, ${name}!</h2>
              <p>Sua conta de <strong>${roleLabel}</strong> foi criada com sucesso na plataforma MovaAgro.</p>
              
              <div class="credentials">
                <h3>📧 Suas Credenciais de Acesso:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Senha:</strong> ${password}</p>
              </div>
              
              <p>⚠️ <strong>Importante:</strong> Recomendamos que altere sua senha após o primeiro acesso.</p>
              
              <p>Acesse a plataforma para começar a utilizar nossos serviços:</p>
              
              <a href="${loginUrl}" class="button">Acessar Plataforma</a>
              
              <p style="margin-top: 30px;">Se você não solicitou esta conta, por favor entre em contato conosco.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} MovaAgro - Todos os direitos reservados</p>
              <p>Transporte agrícola de confiança em Moçambique</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
