
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { empresaImportService } from '../empresaImportService';
import type { ImportEmpresaData } from '../empresaImportService';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
      select: vi.fn(),
    })),
  },
}));

describe('empresaImportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('importEmpresas', () => {
    it('should import companies successfully', async () => {
      const mockData: ImportEmpresaData[] = [
        {
          razaoSocial: 'Test Company',
          nomeFantasia: 'Test',
          cnpj: '12345678901234',
          responsavel: 'John Doe',
          telefone: '1234567890',
          email: 'test@example.com',
          endereco: 'Test Street',
          cidade: 'Test City',
          cep: '12345678',
          nicho: 'servicos',
          desconto: '10%',
          produtos: 'Test Products',
        },
      ];

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await empresaImportService.importEmpresas(mockData);

      expect(result).toBe(1);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('exportEmpresas', () => {
    it('should export companies successfully', async () => {
      const mockData = [
        {
          id: '1',
          razao_social: 'Test Company',
          nome_fantasia: 'Test',
        },
      ];

      const mockSelect = vi.fn().mockResolvedValue({ data: mockData, error: null });
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await empresaImportService.exportEmpresas();

      expect(result).toHaveLength(1);
      expect(supabase.from).toHaveBeenCalledWith('empresas');
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
