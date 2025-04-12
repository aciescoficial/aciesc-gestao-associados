
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: configData } = await supabaseClient
      .from("system_config")
      .select("*")
      .eq("key", "ASAAS_API_KEY")
      .single();

    const apiKey = configData?.value;
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    const { data: envData } = await supabaseClient
      .from("system_config")
      .select("*")
      .eq("key", "ASAAS_ENV")
      .single();
    
    const env = envData?.value || 'sandbox';
    const baseUrl = env === 'production' 
      ? 'https://api.asaas.com/v3' 
      : 'https://sandbox.asaas.com/api/v3';

    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
      throw new Error("Payment ID is required");
    }

    // Check payment status in Asaas
    const paymentResponse = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'access_token': apiKey
      }
    });
    
    const paymentData = await paymentResponse.json();
    
    if (paymentData.error) {
      throw new Error(paymentData.error);
    }
    
    return new Response(
      JSON.stringify({
        id: paymentData.id,
        status: paymentData.status,
        value: paymentData.value,
        dueDate: paymentData.dueDate,
        invoiceUrl: paymentData.invoiceUrl
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
