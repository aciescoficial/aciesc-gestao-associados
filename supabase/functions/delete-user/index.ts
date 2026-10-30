
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Define CORS headers
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
    console.log("Edge function 'delete-user' received a request");
    
    // Parse request body
    const { userId, requestingUserId, deleteAssociado } = await req.json();
    
    // Log request data
    console.log(`Request to delete user ${userId} by requesting user ${requestingUserId}`);
    
    // Validate inputs
    if (!userId || !requestingUserId) {
      console.error("Missing required fields in request body");
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId or requestingUserId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify that the requesting user has admin privileges
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

    // Check if user has admin role
    const hasAdminPrivileges = userData.role === 'admin' || userData.role === 'diretoria';
    
    if (!hasAdminPrivileges) {
      console.error(`Unauthorized: User ${requestingUserId} with role ${userData.role} cannot delete users`);
      return new Response(
        JSON.stringify({ error: 'You do not have permission to delete users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Check if user exists and get associated data
    const { data: targetUserData, error: targetUserError } = await supabaseAdmin
      .from('user')
      .select('associado_id, email, name')
      .eq('id', userId)
      .single();
      
    if (targetUserError) {
      console.error("Error fetching target user data:", targetUserError);
      return new Response(
        JSON.stringify({ error: `Failed to get user data: ${targetUserError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!targetUserData) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    const hasAssociado = !!targetUserData?.associado_id;
    
    // If user is linked to an associado and we want to delete it too
    if (hasAssociado && deleteAssociado) {
      console.log("Deleting associated associado:", targetUserData.associado_id);
      
      // Delete the associado
      const { error: associadoError } = await supabaseAdmin
        .from('associados')
        .delete()
        .eq('id', targetUserData.associado_id);
        
      if (associadoError) {
        console.error("Error deleting associado:", associadoError);
        return new Response(
          JSON.stringify({ error: `Failed to delete associado: ${associadoError.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      console.log("Successfully deleted associado:", targetUserData.associado_id);
    }
    
    // Delete user from user table
    const { error: userDeleteError } = await supabaseAdmin
      .from('user')
      .delete()
      .eq('id', userId);
      
    if (userDeleteError) {
      console.error("Error deleting user from user table:", userDeleteError);
      return new Response(
        JSON.stringify({ error: `Failed to delete user from user table: ${userDeleteError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Delete from auth.users
    try {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (authDeleteError) {
        console.error("Error deleting from auth.users:", authDeleteError);
        // Non-blocking - we'll return success as the user record is already deleted from user table
      } else {
        console.log("Successfully deleted from auth.users");
      }
    } catch (authError) {
      console.error("Exception when trying to delete from auth.users:", authError);
      // Non-blocking - we'll return success as the user record is already deleted from user table
    }
    
    // Log the operation
    try {
      await supabaseAdmin
        .from('operation_logs')
        .insert({
          user_id: requestingUserId,
          event_type: 'delete',
          entity_type: 'user',
          details: `Usuário ${targetUserData?.name} (${targetUserData?.email || userId}) excluído${hasAssociado && deleteAssociado ? ' junto com associado vinculado' : ''}`,
          record_count: 1,
        });
    } catch (logError) {
      console.warn("Failed to log operation:", logError);
      // Non-blocking - continue as the operation was successful
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `User ${targetUserData?.email || userId} deleted successfully${hasAssociado && deleteAssociado ? ' along with associated profile' : ''}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Unexpected error in delete-user function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + (error.message || 'Unknown error') }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
