
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Define CORS headers to ensure the function can be called from the frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Handle HTTP requests to this function
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("Edge function 'update-password' received a request");
    
    // Parse request body
    const { userId, password, requestingUserId } = await req.json();
    
    // Log request data (without sensitive information)
    console.log(`Request to update password for user ${userId} by requesting user ${requestingUserId}`);
    
    // Validate inputs
    if (!userId || !password || !requestingUserId) {
      console.error("Missing required fields in request body");
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId, password, or requestingUserId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify that the requesting user has admin privileges or is updating their own password
    const { data: userData, error: userError } = await supabaseAdmin
      .from('user')
      .select('role')
      .eq('id', requestingUserId)
      .single();

    if (userError) {
      console.error('Error fetching requesting user role:', userError);
      return new Response(
        JSON.stringify({ error: 'Error validating user permissions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Check if user has admin role or is changing their own password
    const isSelfUpdate = requestingUserId === userId;
    const hasAdminPrivileges = userData.role === 'admin' || userData.role === 'diretoria';
    
    if (!hasAdminPrivileges && !isSelfUpdate) {
      console.error(`Unauthorized: User ${requestingUserId} with role ${userData.role} cannot update other users' passwords`);
      return new Response(
        JSON.stringify({ error: 'You do not have permission to update passwords for other users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update the user's password using the admin API
    console.log(`Attempting to update password for user ${userId}`);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password }
    );

    if (error) {
      console.error('Error updating password:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // If this is a password reset from an admin, update the require_password_reset flag
    if (hasAdminPrivileges && !isSelfUpdate) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('user')
          .update({ require_password_reset: true })
          .eq('id', userId);
          
        if (updateError) {
          console.warn('Warning: Failed to update require_password_reset flag:', updateError);
          // Non-blocking - we still want to return success for the password change
        }
      } catch (flagError) {
        console.warn('Exception while updating require_password_reset flag:', flagError);
        // Non-blocking - we still want to return success for the password change
      }
    }

    // When users update their own password, clear the require_password_reset flag
    if (isSelfUpdate) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('user')
          .update({ require_password_reset: false })
          .eq('id', userId);
          
        if (updateError) {
          console.warn('Warning: Failed to clear require_password_reset flag:', updateError);
          // Non-blocking - we still want to return success for the password change
        }
      } catch (flagError) {
        console.warn('Exception while clearing require_password_reset flag:', flagError);
        // Non-blocking - we still want to return success for the password change
      }
    }

    // Log the password change for audit purposes (without the actual password)
    console.log(`Password updated successfully for user ${userId} by ${isSelfUpdate ? 'self' : `admin ${requestingUserId}`}`);

    try {
      // Log the operation for audit purposes
      await supabaseAdmin
        .from('operation_logs')
        .insert({
          user_id: requestingUserId,
          event_type: 'update',
          entity_type: 'user_password',
          details: `Senha alterada para usuário ${userId}`,
        });
    } catch (logError) {
      console.warn('Warning: Failed to log operation:', logError);
      // Non-blocking - we still want to return success
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Unexpected error in update-password function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + (error.message || 'Unknown error') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
