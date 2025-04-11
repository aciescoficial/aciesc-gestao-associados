
/**
 * Format a number as currency in Brazilian format
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a string as CPF (Brazilian individual taxpayer registry)
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove non-numeric characters and ensure it's not too long
  const cleanCPF = cpf.replace(/\D/g, '').slice(0, 11);
  
  // Apply CPF mask
  return cleanCPF
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Format a string as Brazilian phone number
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove non-numeric characters and ensure it's not too long
  const cleanPhone = phone.replace(/\D/g, '').slice(0, 11);
  
  // Apply phone mask based on length (with or without area code)
  if (cleanPhone.length <= 8) {
    return cleanPhone.replace(/(\d{4})(\d)/, '$1-$2');
  } else if (cleanPhone.length <= 10) {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}
