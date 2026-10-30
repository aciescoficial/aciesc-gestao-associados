
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationRequest {
  email: string;
  nome: string;
  associadoId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, nome, associadoId }: ConfirmationRequest = await req.json();
    
    if (!email || !nome) {
      throw new Error("Email and name are required");
    }
    
    // Get associado details
    const { data: associado } = await supabaseAdmin
      .from('associados')
      .select('validade')
      .eq('id', associadoId)
      .single();
      
    if (!associado) {
      throw new Error("Associado not found");
    }
    
    // Format dates for display
    const validadeFormatada = new Date(associado.validade).toLocaleDateString('pt-BR');
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    // Record email in logs
    await supabaseAdmin
      .from('email_logs')
      .insert({
        recipient: email,
        subject: "Pagamento Confirmado - ACIESC",
        status: "sent",
        body: `Confirmação de pagamento para ${nome}, válido até ${validadeFormatada}`
      });
    
    // Return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation email logged successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error sending confirmation email" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
