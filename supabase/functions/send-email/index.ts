
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

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

    const body = await req.json() as EmailRequest;
    const { to, subject, body: emailBody } = body;

    // Validate input
    if (!to || !subject || !emailBody) {
      throw new Error("Missing required fields: to, subject, body");
    }

    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${emailBody}`);

    // Placeholder for email sending functionality
    // In a real implementation, you would connect to an email service
    // like SendGrid, AWS SES, or similar

    // For now, just log the email and store in a table for demo purposes
    const { error } = await supabaseClient
      .from("email_logs")
      .insert({
        recipient: to,
        subject,
        body: emailBody,
        status: "sent" // In a real implementation, this would be based on the email service response
      });

    if (error) {
      throw new Error(`Failed to log email: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email queued for delivery" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
