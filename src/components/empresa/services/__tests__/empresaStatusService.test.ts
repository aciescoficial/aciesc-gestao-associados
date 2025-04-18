
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { empresaStatusService } from '../empresaStatusService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
    })),
  },
}));

describe('empresaStatusService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateEmpresaStatus', () => {
    it('should update company status successfully', async () => {
      const mockUpdate = vi.fn().mockResolvedValue({ error: null });
      const mockEq = vi.fn().mockReturnValue({ update: mockUpdate });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      const result = await empresaStatusService.updateEmpresaStatus('123', 'ativo');

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockEq).toHaveBeenCalledWith('id', '123');
      expect(mockUpdate).toHaveBeenCalledWith({ status: 'ativo' });
    });
  });

  describe('fetchPendingEmpresas', () => {
    it('should fetch pending companies', async () => {
      const mockData = [
        { id: '1', nome_fantasia: 'Pending Company 1' },
        { id: '2', nome_fantasia: 'Pending Company 2' },
      ];

      const mockSelect = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockOrder = vi.fn().mockReturnValue({ select: mockSelect });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.spyOn(supabase, 'from').mockReturnValue({
        eq: mockEq,
      } as any);

      const result = await empresaStatusService.fetchPendingEmpresas();

      expect(result).toHaveLength(2);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockEq).toHaveBeenCalledWith('status', 'pendente');
    });
  });
});
