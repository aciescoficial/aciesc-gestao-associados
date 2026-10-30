import { supabase } from '@/integrations/supabase/client';
import { AssociadoInteresse, AprovacaoResult, RejeicaoResult } from '../types/associadoInteresse';
import { generateAssociadoPayment } from './associadoPaymentService';
import { createUserForAssociado } from './associadoUserService';

export const interessadoService = {
  async aprovarInteressado(id: string, associationTypeId: string): Promise<AprovacaoResult> {
    console.log('Approving interest:', id, 'with association type:', associationTypeId);
    
    try {
      // 1. Get interessado data
      const { data: interessado, error: fetchError } = await supabase
        .from('associado_interesse')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError || !interessado) {
        console.error('Error fetching interest data:', fetchError);
        return {
          success: false,
          message: fetchError?.message || 'Interessado não encontrado'
        };
      }
      
      // 2. Generate payment link
      const paymentResult = await generateAssociadoPayment({
        associadoInteresseId: id,
        associationTypeId,
        email: interessado.email,
        nome: interessado.nome,
        sobrenome: interessado.sobrenome,
        cpf: interessado.cpf
      });
      
      if (!paymentResult.paymentUrl) {
        console.error('Error generating payment:', paymentResult);
        return {
          success: false,
          message: 'Erro ao gerar link de pagamento'
        };
      }
      
      // 3. Update interessado status
      const { error: updateError } = await supabase
        .from('associado_interesse')
        .update({ 
          status: 'aprovado',
          pagamento_url: paymentResult.paymentUrl
        })
        .eq('id', id);
        
      if (updateError) {
        console.error('Error updating interest status:', updateError);
        return {
          success: false,
          message: updateError.message
        };
      }
      
      // 4. Create user account
      const userResult = await createUserForAssociado({
        id: id, // Using interesse ID temporarily until associado record is created
        email: interessado.email,
        nome: interessado.nome,
        sobrenome: interessado.sobrenome,
        cpf: interessado.cpf
      });
      
      if (!userResult.success) {
        console.warn('User creation warning:', userResult.error);
        // Continue anyway, as this is not critical for the approval process
      }
      
      // 5. Create associado record
      const { error: associadoError } = await supabase
        .from('associados')
        .insert({
          nome: interessado.nome,
          sobrenome: interessado.sobrenome,
          email: interessado.email,
          cpf: interessado.cpf,
          telefone: interessado.celular,
          cidade: interessado.cidade,
          estado: interessado.estado,
          creci: interessado.creci,
          status: 'pendente'
        });
        
      if (associadoError) {
        console.error('Error creating associado record:', associadoError);
        // Continue anyway as the payment and approval are more important
      }
      
      return {
        success: true,
        message: 'Interessado aprovado com sucesso',
        paymentUrl: paymentResult.paymentUrl
      };
    } catch (error: any) {
      console.error('Critical error in aprovarInteressado:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  async rejeitarInteressado(id: string, motivo: string): Promise<RejeicaoResult> {
    console.log('Rejecting interest:', { id, motivo });
    
    try {
      const { error } = await supabase
        .from('associado_interesse')
        .update({ 
          status: 'rejeitado',
          motivo_rejeicao: motivo
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error rejecting interest:', error);
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: true,
        message: 'Interessado rejeitado com sucesso'
      };
    } catch (error: any) {
      console.error('Critical error in rejeitarInteressado:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
};
