
import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  email: string;
  nome: string;
  sobrenome: string;
  associadoId: string;
}

interface CreateUserParams {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  cpf: string;
}

/**
 * Check if a user already exists with the given email
 * @param email Email to check
 * @returns Whether the user exists and any error
 */
const checkUserExists = async (email: string) => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('user')
      .select('id, email, associado_id')
      .eq('email', email)
      .maybeSingle();
    
    return { existingUser, checkError };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { 
      existingUser: null, 
      checkError: error 
    };
  }
};

/**
 * Send registration email with link to register
 */
export const sendRegistrationEmail = async ({ email, nome, sobrenome, associadoId }: SendEmailParams) => {
  try {
    console.log(`Sending registration email to ${email} for associado ${associadoId}`);
    
    // Check if user already exists with this email
    const { existingUser, checkError } = await checkUserExists(email);
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return {
        success: false,
        error: checkError
      };
    }
    
    if (existingUser) {
      console.log("User already exists with this email:", email);
      
      // Check if already linked to this associado
      if (existingUser.associado_id === associadoId) {
        // Already linked, no need to send email
        return {
          success: true,
          message: "Usuário já existe e está vinculado a este associado."
        };
      }
      
      // Update user to link to this associado
      await supabase
        .from('user')
        .update({ associado_id: associadoId })
        .eq('id', existingUser.id);
        
      return {
        success: true,
        message: "Usuário existente foi vinculado a este associado."
      };
    }
    
    // No existing user, send registration email
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          template_id: 'convite_cadastro',
          template_data: {
            nome: `${nome} ${sobrenome}`,
            link_cadastro: `${window.location.origin}/cadastro?associado=${associadoId}`
          }
        }
      });
      
      if (error) {
        console.error("Error sending registration email:", error);
        return {
          success: false,
          error
        };
      }
      
      return { success: true };
    } catch (emailError) {
      console.error("Exception sending registration email:", emailError);
      
      // Special handling for rate limits
      if (typeof emailError === 'object' && emailError && 'message' in emailError &&
          (emailError.message as string).toLowerCase().includes('rate limit')) {
        return {
          success: false,
          error: {
            message: "Limite de envio de emails excedido. Tente novamente mais tarde.",
            isRateLimit: true
          }
        };
      }
      
      return {
        success: false,
        error: emailError
      };
    }
  } catch (error) {
    console.error("Erro geral ao enviar e-mail de cadastro:", error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Create a new user account for an associado
 * Handles existing users, rate limits and various error scenarios
 */
export const createUserForAssociado = async ({ id, email, nome, sobrenome, cpf }: CreateUserParams) => {
  try {
    console.log("Creating user for associado:", { id, email, nome, sobrenome });
    
    // Check if user already exists with this email
    const { existingUser, checkError } = await checkUserExists(email);
    
    if (checkError) {
      console.error("Error checking existing user:", checkError);
      return {
        success: false,
        error: checkError
      };
    }
    
    if (existingUser) {
      console.log("User already exists with this email:", email);
      
      // Check if the user is already linked to this associado
      if (existingUser.associado_id === id) {
        // Already linked to this associado
        return { 
          success: true,
          message: "Usuário já existe e está vinculado a este associado."
        };
      } else {
        // Link the existing user to this associado
        const { error: updateError } = await supabase
          .from('user')
          .update({ associado_id: id })
          .eq('id', existingUser.id);
          
        if (updateError) {
          console.error("Error linking user to associado:", updateError);
          return {
            success: false,
            error: updateError
          };
        }
        
        return { 
          success: true,
          message: "Usuário existente foi vinculado a este associado."
        };
      }
    }
    
    // Create a temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(10).slice(-2);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            name: `${nome} ${sobrenome}`,
            cpf,
            associado_id: id
          }
        }
      });
      
      if (authError) {
        console.error("Auth error creating user:", authError);
        
        // Handle rate limit errors specially
        if (authError.status === 429 || 
            authError.message.includes('rate limit') || 
            authError.message.includes('exceeded') ||
            authError.code === 'over_email_send_rate_limit') {
            
          // Try to create the user without email confirmation
          return await createUserWithoutEmail({ id, email, nome, sobrenome, cpf }, tempPassword);
        }
        
        return {
          success: false,
          error: authError
        };
      }
      
      if (!authData || !authData.user) {
        return {
          success: false,
          error: { message: "Falha ao criar usuário - nenhum usuário retornado da API" }
        };
      }
      
      // Update user record with associado_id and other info
      const { error: userUpdateError } = await supabase
        .from('user')
        .update({
          associado_id: id,
          name: `${nome} ${sobrenome}`,
          cpf,
          active: true
        })
        .eq('id', authData.user.id);
        
      if (userUpdateError) {
        console.error("Error updating user info:", userUpdateError);
        return {
          success: false,
          error: userUpdateError
        };
      }
      
      return { 
        success: true,
        userId: authData.user.id 
      };
    } catch (authError) {
      console.error("Exception during user creation:", authError);
      return {
        success: false,
        error: authError
      };
    }
  } catch (error) {
    console.error("General error creating user for associado:", error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Alternative method to create users when email sending fails (e.g. rate limits)
 * Creates the user with admin API or directly in the database
 */
const createUserWithoutEmail = async (params: CreateUserParams, tempPassword: string) => {
  try {
    console.log("Creating user without email for associado:", params.id);

    try {
      const { data: authData, error: adminAuthError } = await supabase.auth.admin.createUser({
        email: params.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: `${params.nome} ${params.sobrenome}`,
          cpf: params.cpf,
          associado_id: params.id
        }
      });

      if (adminAuthError) {
        console.error("Admin auth error:", adminAuthError);

        if (adminAuthError.message.includes('insufficient_permissions')) {
          // Create a record in user table even without auth user
          const { error: userError } = await supabase
            .from('user')
            .upsert({
              id: crypto.randomUUID(),
              name: `${params.nome} ${params.sobrenome}`,
              email: params.email,
              cpf: params.cpf,
              associado_id: params.id,
              role: 'user',
              active: true,
              first_login: true
            });

          if (userError) {
            console.error("Error creating placeholder user:", userError);
            return {
              success: false,
              error: userError
            };
          }

          return {
            success: true,
            message: "Registro de usuário criado sem autenticação. Email será enviado para cadastro.",
            passwordSet: false
          };
        }

        return {
          success: false,
          error: adminAuthError
        };
      }

      if (!authData || !authData.user) {
        return {
          success: false,
          error: { message: "Falha ao criar usuário - nenhum usuário retornado da API" }
        };
      }

      // Update user table with associado info
      const { error: userError } = await supabase
        .from('user')
        .upsert({
          id: authData.user.id,
          name: `${params.nome} ${params.sobrenome}`,
          email: params.email,
          cpf: params.cpf,
          associado_id: params.id,
          role: 'user',
          active: true,
          first_login: true
        });

      if (userError) {
        console.error("Error updating user data:", userError);
        return {
          success: false,
          error: userError
        };
      }

      console.log("User created without email confirmation:", authData.user.id);

      return {
        success: true,
        userId: authData.user.id,
        message: "Usuário criado sem envio de email. Senha temporária está disponível.",
        passwordSet: true,
        tempPassword
      };
    } catch (error) {
      console.error("Exception creating user without email:", error);
      return {
        success: false,
        error
      };
    }
  } catch (error) {
    console.error("General error in createUserWithoutEmail:", error);
    return {
      success: false,
      error
    };
  }
};

// Export the services as an object for easier importing
export const associadoUserService = {
  sendRegistrationEmail,
  createUserForAssociado,
  checkUserExists
};
