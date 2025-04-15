
import { supabase } from "@/integrations/supabase/client";
import { getTemplateTestData } from '@/components/configuracoes/services/emailService';

interface CreateUserParams {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  cpf: string;
}

interface SendEmailParams {
  email: string;
  nome: string;
  sobrenome: string;
  associadoId: string;
}

/**
 * Create a new user account for the associado
 */
export const createUserForAssociado = async ({ id, email, nome, sobrenome, cpf }: CreateUserParams) => {
  try {
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(2, 10);
    
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: {
          name: `${nome} ${sobrenome}`,
          associado_id: id,
          role: 'user'
        }
      }
    });
    
    if (authError) throw authError;

    // Update user table with additional data
    if (authData && authData.user) {
      const { error: userError } = await supabase
        .from('user')
        .update({
          name: `${nome} ${sobrenome}`,
          email,
          role: 'user',
          associado_id: id,
          tags: ['associado', 'first_login'], // Using 'first_login' tag instead of column
          active: true,
        })
        .eq('id', authData.user.id);

      if (userError) throw userError;

      // Send email with login instructions
      await enviarEmailUsuarioCriado({
        email,
        nome,
        sobrenome,
        associadoId: id
      });
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao criar usuário para associado:", error);
    throw error;
  }
};

/**
 * Send an email to a newly created user
 */
const enviarEmailUsuarioCriado = async ({ email, nome, sobrenome, associadoId }: SendEmailParams) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        template_id: 'usuario_criado',
        template_data: {
          nome: `${nome} ${sobrenome}`,
          link_login: `${window.location.origin}/auth/login`,
          password: 'Enviada separadamente por segurança' // The actual password is not included in the email for security reasons
        }
      }
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail para usuário criado:", error);
    throw error;
  }
};

/**
 * Send registration email with link to register
 */
export const sendRegistrationEmail = async ({ email, nome, sobrenome, associadoId }: SendEmailParams) => {
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
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail de cadastro:", error);
    throw error;
  }
};
