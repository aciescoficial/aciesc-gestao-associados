
import { supabase } from "@/integrations/supabase/client";
import { ImportAssociadoData } from "../../types";
import { useToast } from "@/hooks/use-toast";

/**
 * Create users for a batch of imported associados
 */
export const createUsersForBatch = async (insertedData: any[], batch: ImportAssociadoData[]) => {
  console.log("Creating users for batch of", batch.length, "associados");
  
  const results = {
    success: 0,
    failures: 0,
    retries: 0,
    linked: 0,
  };
  
  for (let i = 0; i < batch.length; i++) {
    try {
      const associado = batch[i];
      const insertedAssociado = insertedData.find(item => item.email === associado.email);
      
      if (insertedAssociado && insertedAssociado.id) {
        // First, check if user already exists for this associado
        const { data: existingUser, error: checkError } = await supabase
          .from('user')
          .select('id, email')
          .eq('email', associado.email)
          .maybeSingle();
        
        if (checkError) {
          console.error("Error checking existing user:", checkError);
          results.failures++;
          continue;
        }
        
        if (existingUser) {
          console.log(`User already exists for ${associado.email}, linking to associado`);
          // Link existing user to associado
          const { error: linkError } = await supabase
            .from('user')
            .update({ associado_id: insertedAssociado.id })
            .eq('id', existingUser.id);
            
          if (linkError) {
            console.error("Error linking user to associado:", linkError);
            results.failures++;
          } else {
            results.linked++;
          }
          continue;
        }
        
        // Create new user if doesn't exist
        console.log(`Creating user for associado: ${associado.nome} (${associado.email})`);
        
        // First try with edge function
        try {
          const { error: userError } = await supabase.functions.invoke('create-user', {
            body: {
              associadoId: insertedAssociado.id,
              email: associado.email,
              nome: associado.nome,
              sobrenome: associado.sobrenome,
              cpf: associado.cpf
            }
          });

          if (userError) {
            throw userError;
          }
          
          results.success++;
          console.log(`User created for ${associado.nome} ${associado.sobrenome}`);
        } catch (edgeFunctionError) {
          console.error("Edge function error, falling back to direct DB creation:", edgeFunctionError);
          results.retries++;
          
          // Fall back to direct database creation
          try {
            const { error: dbUserError } = await supabase
              .from('user')
              .insert({
                id: crypto.randomUUID(),
                name: `${associado.nome} ${associado.sobrenome}`,
                email: associado.email,
                cpf: associado.cpf,
                associado_id: insertedAssociado.id,
                role: 'user',
                active: true,
                tags: ['associado']
              });
              
            if (dbUserError) {
              console.error("Error creating user record:", dbUserError);
              results.failures++;
            } else {
              results.success++;
              console.log(`User record created for ${associado.nome} ${associado.sobrenome}`);
            }
          } catch (dbError) {
            console.error("Error in fallback user creation:", dbError);
            results.failures++;
          }
        }
      } else {
        console.error(`Associado not found in inserted data: ${associado.email}`);
        results.failures++;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      results.failures++;
    }
  }
  
  console.log("User creation results:", results);
  return results;
};
