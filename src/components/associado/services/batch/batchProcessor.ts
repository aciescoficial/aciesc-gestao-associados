
import { supabase } from "@/integrations/supabase/client";
import { ImportAssociadoData } from "../../types";
import { createUsersForBatch } from "../userCreation/userCreationService";
import { Database } from "@/integrations/supabase/types";

type AssociadoStatus = Database['public']['Enums']['status_type'];

/**
 * Process associados in batches to avoid hitting Supabase limits
 * @param associados Array of associados to import
 * @param criarUsuarios Boolean to indicate if users should be created
 * @returns Number of successfully imported associados
 */
export const processBatches = async (
  associados: ImportAssociadoData[],
  criarUsuarios: boolean
): Promise<number> => {
  // Define batch size
  const BATCH_SIZE = 30;
  
  // Split associados into batches
  const batches: ImportAssociadoData[][] = [];
  for (let i = 0; i < associados.length; i += BATCH_SIZE) {
    batches.push(associados.slice(i, i + BATCH_SIZE));
  }
  
  console.log(`Processing ${associados.length} associados in ${batches.length} batches of max ${BATCH_SIZE}`);
  
  let totalInserted = 0;
  let allInsertedData: any[] = [];
  
  // Process each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1} of ${batches.length} with ${batch.length} associados`);
    
    try {
      // Map data for insertion - ensure all date fields are converted to strings and status is a valid enum value
      const dataToInsert = batch.map(associado => {
        // Ensure status is a valid enum value
        let status: AssociadoStatus = 'pendente';
        if (associado.status === 'ativo' || associado.status === 'inativo' || associado.status === 'aprovado') {
          status = associado.status as AssociadoStatus;
        }
        
        return {
          nome: associado.nome,
          sobrenome: associado.sobrenome,
          cpf: associado.cpf,
          email: associado.email,
          telefone: associado.celular,
          creci: associado.creci || null,
          cidade: associado.cidade,
          estado: associado.estado || 'SC',
          cep: associado.cep || null,
          rua: associado.rua || null,
          numero: associado.numero || null,
          complemento: associado.complemento || null,
          bairro: associado.bairro || null,
          placa_principal: associado.placaPrincipal || null,
          placa_secundaria: associado.placaSecundaria || null,
          valor_pago: associado.valorPago || null,
          valor_devido: associado.valorDevido || null,
          tipo_pagamento: associado.tipoPagamento || null,
          tipo_associado: associado.tipoAssociado || null,
          validade: associado.validade ? String(associado.validade) : null,
          data_nascimento: associado.dataNascimento ? String(associado.dataNascimento) : null,
          status: status
        };
      });
      
      // Insert data
      const { data: insertedData, error } = await supabase
        .from('associados')
        .insert(dataToInsert)
        .select();
      
      // Handle errors
      if (error) {
        console.error(`Error inserting batch ${i + 1}:`, error);
        
        // Try to insert one by one to identify problematic records
        console.log("Trying individual insertions for batch...");
        const individualResults = await processIndividualInsertions(dataToInsert);
        
        // Add successfully inserted data to the results
        if (individualResults.length > 0) {
          allInsertedData = [...allInsertedData, ...individualResults];
          totalInserted += individualResults.length;
        }
      } else {
        console.log(`Successfully inserted ${insertedData.length} associados in batch ${i + 1}`);
        allInsertedData = [...allInsertedData, ...insertedData];
        totalInserted += insertedData.length;
        
        // Create users if requested
        if (criarUsuarios && insertedData.length > 0) {
          try {
            await createUsersForBatch(insertedData, batch);
          } catch (userError) {
            console.error(`Error creating users for batch ${i + 1}:`, userError);
          }
        }
      }
    } catch (batchError) {
      console.error(`Error processing batch ${i + 1}:`, batchError);
    }
  }
  
  console.log(`Import completed. Total inserted: ${totalInserted} of ${associados.length}`);
  return totalInserted;
};

/**
 * Process individual insertions for records in a batch that failed
 */
async function processIndividualInsertions(dataToInsert: any[]): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < dataToInsert.length; i++) {
    try {
      const record = dataToInsert[i];
      
      // Check for duplicate CPF or email before inserting
      const { data: existingData } = await supabase
        .from('associados')
        .select('id')
        .or(`cpf.eq.${record.cpf},email.eq.${record.email}`)
        .maybeSingle();
      
      if (existingData) {
        console.log(`Skipping insertion for ${record.nome} ${record.sobrenome} - duplicate CPF or email`);
        continue;
      }
      
      // Try to insert
      const { data, error } = await supabase
        .from('associados')
        .insert(record)
        .select()
        .single();
        
      if (error) {
        console.error(`Error inserting record ${i}:`, error);
      } else {
        results.push(data);
        console.log(`Successfully inserted individual record for ${record.nome} ${record.sobrenome}`);
      }
    } catch (error) {
      console.error(`Error processing individual record ${i}:`, error);
    }
  }
  
  return results;
}
