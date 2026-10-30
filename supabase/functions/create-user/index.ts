
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const requestData = await req.json();
    const { 
      email, 
      nome, 
      sobrenome = "", 
      role = "user", 
      tags = [], 
      associado_id = null, 
      empresa_id = null,
      associadoId = null, // for backward compatibility
      active = true
    } = requestData;

    // Set the ID to use for the associado (accepting both parameter formats)
    const finalAssociadoId = associadoId || associado_id;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email é obrigatório" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Creating user: ${email} with role ${role}`);

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("user")
      .select("id, email, associado_id")
      .eq("email", email)
      .maybeSingle();

    if (userCheckError) {
      throw new Error(`Error checking existing user: ${userCheckError.message}`);
    }

    if (existingUser) {
      console.log(`User already exists for email ${email}`);
      
      // Update existing user if needed
      const updatePayload: any = {};
      
      if (nome && sobrenome) {
        updatePayload.name = `${nome} ${sobrenome}`.trim();
      }
      
      if (role) {
        updatePayload.role = role;
      }
      
      if (tags && Array.isArray(tags)) {
        updatePayload.tags = tags;
      }
      
      if (finalAssociadoId && existingUser.associado_id !== finalAssociadoId) {
        updatePayload.associado_id = finalAssociadoId;
      }
      
      if (empresa_id !== undefined) {
        updatePayload.empresa_id = empresa_id;
      }
      
      // Only update if we have fields to update
      if (Object.keys(updatePayload).length > 0) {
        console.log(`Updating existing user: ${existingUser.id}`, updatePayload);
        
        const { error: updateError } = await supabase
          .from("user")
          .update(updatePayload)
          .eq("id", existingUser.id);
          
        if (updateError) {
          throw new Error(`Error updating user: ${updateError.message}`);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          message: "Usuário existente atualizado", 
          userId: existingUser.id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(10).slice(-2);

    // Create a new user with Supabase Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name: `${nome} ${sobrenome}`.trim(),
        role: role
      },
    });

    if (createError) {
      // If there's a rate limit error, try creating user directly in the database
      if (createError.status === 429 || createError.message.includes('rate limit')) {
        console.log("Rate limit hit, creating user directly in database");
        
        // Generate a UUID for the user
        const userId = crypto.randomUUID();
        
        const userData = {
          id: userId,
          name: `${nome} ${sobrenome}`.trim(),
          email,
          role: role,
          associado_id: finalAssociadoId,
          empresa_id: empresa_id,
          active: active,
          tags: tags,
          require_password_reset: true
        };
        
        const { error: directInsertError } = await supabase
          .from("user")
          .insert(userData);
          
        if (directInsertError) {
          throw new Error(`Error inserting user data directly: ${directInsertError.message}`);
        }
        
        console.log(`User created directly in database: ${userId}`);
        
        return new Response(
          JSON.stringify({
            message: "User created in database without auth",
            userId,
            needsEmailInvite: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Error creating user: ${createError.message}`);
    }

    const userData = {
      id: newUser.user.id,
      name: `${nome} ${sobrenome}`.trim(),
      email,
      role: role,
      associado_id: finalAssociadoId,
      empresa_id: empresa_id,
      active: active,
      tags: tags,
      require_password_reset: true
    };

    // Insert user data into user table
    const { error: userInsertError } = await supabase
      .from("user")
      .upsert(userData);

    if (userInsertError) {
      throw new Error(`Error inserting user data: ${userInsertError.message}`);
    }

    console.log(`User created successfully: ${newUser.user.id}`);

    // Try to send a password reset invitation
    try {
      // Use built-in Supabase password reset flow
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${req.headers.get("origin") || 'https://aciesc.com.br'}/reset-password?redirect=/dashboard`
        }
      );
      
      if (resetError) {
        console.warn("Não foi possível enviar email de definição de senha:", resetError);
        
        if (resetError.status === 429 || resetError.message.includes('rate limit')) {
          return new Response(
            JSON.stringify({
              message: "Usuário criado mas sem envio de email (rate limit)",
              userId: newUser.user.id,
              needsEmailInvite: true,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify({
            message: "Usuário criado mas sem envio de email",
            userId: newUser.user.id,
            needsEmailInvite: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (resetError) {
      console.error("Exceção ao enviar email de definição de senha:", resetError);
      // Continue regardless of email sending errors
    }

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        userId: newUser.user.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
