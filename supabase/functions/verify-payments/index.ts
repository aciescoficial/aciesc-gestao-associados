
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * This function periodically checks the payment status of pending associates
 * and activates them if the payment is confirmed
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get all associado_interesse records with payment URLs but not yet confirmed
    const { data: pendingPayments, error: fetchError } = await supabaseAdmin
      .from('associado_interesse')
      .select('*')
      .eq('status', 'aprovado')
      .eq('pagamento_confirmado', false)
      .not('pagamento_url', 'is', null);
      
    if (fetchError) {
      throw new Error(`Failed to fetch pending payments: ${fetchError.message}`);
    }
    
    console.log(`Found ${pendingPayments?.length || 0} pending payments to check`);
    
    const results = {
      checked: 0,
      confirmed: 0,
      errors: 0,
      payments: [] as Array<{ id: string; status: string; success: boolean }>
    };
    
    // For each pending payment, check status
    if (pendingPayments && pendingPayments.length > 0) {
      for (const payment of pendingPayments) {
        try {
          results.checked++;
          
          // Extract payment ID from URL or payment data
          const paymentUrl = payment.pagamento_url;
          const paymentIdMatch = paymentUrl?.match(/\/(?:payment|pagamento|invoice)\/([a-zA-Z0-9]+)/);
          const paymentId = paymentIdMatch ? paymentIdMatch[1] : null;
          
          if (!paymentId) {
            console.log(`Could not extract payment ID from URL: ${paymentUrl}`);
            results.payments.push({
              id: payment.id,
              status: "error",
              success: false
            });
            continue;
          }
          
          // Check payment status with payment provider
          const { data: checkResult, error: checkError } = await supabaseAdmin.functions.invoke("asaas-payment-check", {
            body: { paymentId }
          });
          
          if (checkError) {
            console.error(`Error checking payment for ${payment.id}: ${checkError.message}`);
            results.errors++;
            results.payments.push({
              id: payment.id,
              status: "error",
              success: false
            });
            continue;
          }
          
          console.log(`Payment status for ${payment.id}: ${checkResult.status}`);
          
          // If payment is confirmed
          if (checkResult.isPaid) {
            results.confirmed++;
            
            // Update associado_interesse record
            await supabaseAdmin
              .from('associado_interesse')
              .update({
                pagamento_confirmado: true,
                pagamento_data: new Date().toISOString()
              })
              .eq('id', payment.id);
              
            // Find associado record to update
            const { data: associado } = await supabaseAdmin
              .from('associados')
              .select('id')
              .eq('email', payment.email)
              .eq('status', 'pendente')
              .maybeSingle();
              
            if (associado) {
              // Calculate membership validity (1 year from payment)
              const now = new Date();
              const validUntil = new Date(now.setFullYear(now.getFullYear() + 1));
              
              // Update associado status
              await supabaseAdmin
                .from('associados')
                .update({
                  status: 'ativo',
                  data_ultimo_pagamento: new Date().toISOString(),
                  validade: validUntil.toISOString().split('T')[0]
                })
                .eq('id', associado.id);
                
              console.log(`Activated associado ${associado.id} with validity until ${validUntil.toISOString()}`);
              
              // Log the activation in operations log
              await supabaseAdmin
                .from('operation_logs')
                .insert({
                  entity_type: 'associado',
                  event_type: 'payment_confirmation',
                  details: `Pagamento confirmado automaticamente para associado ${associado.id}`
                });
                
              // Send confirmation email
              try {
                await supabaseAdmin.functions.invoke("send-payment-confirmation", {
                  body: {
                    email: payment.email,
                    nome: payment.nome,
                    associadoId: associado.id
                  }
                });
              } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
              }
            }
            
            results.payments.push({
              id: payment.id,
              status: "confirmed",
              success: true
            });
          } else {
            // Payment not confirmed yet
            results.payments.push({
              id: payment.id,
              status: checkResult.status,
              success: false
            });
          }
        } catch (itemError) {
          console.error(`Error processing payment ${payment.id}: ${itemError.message}`);
          results.errors++;
          results.payments.push({
            id: payment.id,
            status: "error",
            success: false
          });
        }
      }
    }
    
    return new Response(JSON.stringify({ 
      message: "Payment verification completed",
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying payments:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Unknown error during payment verification" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
