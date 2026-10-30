
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  to: string;
  subject: string;
  body: string;
  cc?: string[];
  templateId?: string;
  templateData?: Record<string, any>;
}

/**
 * Envia um email usando a edge function
 */
export const sendEmail = async (emailData: EmailData): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        recipients: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        body: emailData.body,
        cc: emailData.cc,
        template_id: emailData.templateId,
        template_data: emailData.templateData
      }
    });
    
    if (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }
    
    return { success: true, message: 'Email enviado com sucesso' };
  } catch (error: any) {
    console.error("Falha ao enviar email:", error);
    return { 
      success: false, 
      message: `Falha ao enviar email: ${error.message || 'Erro desconhecido'}` 
    };
  }
};

/**
 * Envia email de boas-vindas para associado aprovado
 */
export const enviarEmailBoasVindas = async (
  email: string, 
  nome: string,
  sobrenome: string,
  senha: string | null, 
  linkPagamento: string | null
): Promise<{ success: boolean; message: string }> => {
  try {
    const loginUrl = window.location.origin + '/login';
    const senhaInfo = senha ? `<p>Sua senha temporária é: <strong>${senha}</strong></p>` : '';
    const pagamentoInfo = linkPagamento 
      ? `<p>Para finalizar seu cadastro, realize o pagamento da anuidade através do link abaixo:</p>
         <p><a href="${linkPagamento}" target="_blank">Clique aqui para realizar o pagamento</a></p>`
      : '';
    
    const body = `
      <h2>Bem-vindo à ACIESC!</h2>
      <p>Olá ${nome} ${sobrenome},</p>
      <p>Seu cadastro foi aprovado com sucesso!</p>
      <p>Acesse sua conta através do link: <a href="${loginUrl}" target="_blank">${loginUrl}</a></p>
      <p>Seu usuário: ${email}</p>
      ${senhaInfo}
      ${pagamentoInfo}
      <p>Após o login, não esqueça de alterar sua senha.</p>
      <p>Atenciosamente,<br>Equipe ACIESC</p>
    `;
    
    return await sendEmail({
      to: email,
      subject: 'Bem-vindo à ACIESC - Cadastro Aprovado',
      body: body,
      templateId: 'bem_vindo_associado',
      templateData: {
        nome: nome,
        sobrenome: sobrenome,
        login_url: loginUrl,
        email: email,
        senha: senha,
        pagamento_url: linkPagamento
      }
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de boas-vindas:", error);
    return { success: false, message: `Erro ao enviar email: ${error.message}` };
  }
};

/**
 * Envia email de lembrete de pagamento
 */
export const enviarLembretePagamento = async (
  email: string,
  nome: string,
  linkPagamento: string,
  dataVencimento: string
): Promise<{ success: boolean; message: string }> => {
  const dataFormatada = new Date(dataVencimento).toLocaleDateString('pt-BR');
  
  const body = `
    <h2>Lembrete de Pagamento - ACIESC</h2>
    <p>Olá ${nome},</p>
    <p>Este é um lembrete de que sua anuidade vence em <strong>${dataFormatada}</strong>.</p>
    <p>Para manter sua associação ativa, realize o pagamento através do link abaixo:</p>
    <p><a href="${linkPagamento}" target="_blank">Clique aqui para realizar o pagamento</a></p>
    <p>Atenciosamente,<br>Equipe ACIESC</p>
  `;
  
  return await sendEmail({
    to: email,
    subject: 'Lembrete de Pagamento - ACIESC',
    body: body,
    templateId: 'lembrete_pagamento',
    templateData: {
      nome: nome,
      data_vencimento: dataFormatada,
      pagamento_url: linkPagamento
    }
  });
};

/**
 * Envia email de confirmação de pagamento
 */
export const enviarConfirmacaoPagamento = async (
  email: string,
  nome: string,
  valorPago: string,
  dataProximoVencimento: string
): Promise<{ success: boolean; message: string }> => {
  const dataFormatada = new Date(dataProximoVencimento).toLocaleDateString('pt-BR');
  
  const body = `
    <h2>Confirmação de Pagamento - ACIESC</h2>
    <p>Olá ${nome},</p>
    <p>Seu pagamento de <strong>R$ ${valorPago}</strong> foi confirmado com sucesso!</p>
    <p>Sua associação está ativa até ${dataFormatada}.</p>
    <p>Atenciosamente,<br>Equipe ACIESC</p>
  `;
  
  return await sendEmail({
    to: email,
    subject: 'Pagamento Confirmado - ACIESC',
    body: body,
    templateId: 'confirmacao_pagamento',
    templateData: {
      nome: nome,
      valor: valorPago,
      data_proximo_vencimento: dataFormatada
    }
  });
};

export const emailNotificationService = {
  sendEmail,
  enviarEmailBoasVindas,
  enviarLembretePagamento,
  enviarConfirmacaoPagamento
};
