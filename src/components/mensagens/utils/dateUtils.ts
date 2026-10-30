
import { formatDistanceToNow, parseISO, isToday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formats a date string to a human-readable relative format
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    
    // If the date is today, show "Hoje às HH:MM"
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    }
    
    // For recent dates, show relative time
    const distanceStr = formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR
    });
    
    // For dates older than a week, show the full date
    const isOlderThanWeek = Date.now() - date.getTime() > 7 * 24 * 60 * 60 * 1000;
    if (isOlderThanWeek) {
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    }
    
    return distanceStr;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'Data desconhecida';
  }
}
