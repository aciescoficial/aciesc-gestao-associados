
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface EmpresaFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site: string;
  instagram: string;
  whatsapp: string;
  nicho: string;
  desconto: string;
  produtos: string;
}

const CadastroEmpresa: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmpresaFormData>();
  
  const nichos = [
    "Alimentação", 
    "Saúde", 
    "Educação", 
    "Serviços", 
    "Comércio", 
    "Lazer", 
    "Tecnologia", 
    "Outro"
  ];
  
  const onSubmit = async (data: EmpresaFormData) => {
    setIsSubmitting(true);
    
    try {
      // Mock API call - would send data to backend in real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "A empresa foi cadastrada e está aguardando aprovação.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao cadastrar a empresa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="wp-header">Cadastrar Empresa Conveniada</h1>
      
      <div className="wp-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Razão Social */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Razão Social*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.razaoSocial ? 'border-wp-error' : ''}`}
                {...register('razaoSocial', { required: "Razão Social é obrigatória" })}
              />
              {errors.razaoSocial && <p className="text-wp-error text-sm">{errors.razaoSocial.message}</p>}
            </div>
            
            {/* Nome Fantasia */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nome Fantasia*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.nomeFantasia ? 'border-wp-error' : ''}`}
                {...register('nomeFantasia', { required: "Nome Fantasia é obrigatório" })}
              />
              {errors.nomeFantasia && <p className="text-wp-error text-sm">{errors.nomeFantasia.message}</p>}
            </div>
            
            {/* CNPJ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">CNPJ*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cnpj ? 'border-wp-error' : ''}`}
                placeholder="00.000.000/0001-00"
                {...register('cnpj', { required: "CNPJ é obrigatório" })}
              />
              {errors.cnpj && <p className="text-wp-error text-sm">{errors.cnpj.message}</p>}
            </div>
            
            {/* Responsável */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Responsável*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.responsavel ? 'border-wp-error' : ''}`}
                {...register('responsavel', { required: "Responsável é obrigatório" })}
              />
              {errors.responsavel && <p className="text-wp-error text-sm">{errors.responsavel.message}</p>}
            </div>
            
            {/* Telefone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Telefone*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.telefone ? 'border-wp-error' : ''}`}
                placeholder="(00) 00000-0000"
                {...register('telefone', { required: "Telefone é obrigatório" })}
              />
              {errors.telefone && <p className="text-wp-error text-sm">{errors.telefone.message}</p>}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">E-mail*</label>
              <input
                type="email"
                className={`wp-input w-full ${errors.email ? 'border-wp-error' : ''}`}
                {...register('email', { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  } 
                })}
              />
              {errors.email && <p className="text-wp-error text-sm">{errors.email.message}</p>}
            </div>
            
            {/* Endereço */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium">Endereço*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.endereco ? 'border-wp-error' : ''}`}
                {...register('endereco', { required: "Endereço é obrigatório" })}
              />
              {errors.endereco && <p className="text-wp-error text-sm">{errors.endereco.message}</p>}
            </div>
            
            {/* Cidade */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cidade*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cidade ? 'border-wp-error' : ''}`}
                {...register('cidade', { required: "Cidade é obrigatória" })}
              />
              {errors.cidade && <p className="text-wp-error text-sm">{errors.cidade.message}</p>}
            </div>
            
            {/* CEP */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">CEP*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.cep ? 'border-wp-error' : ''}`}
                placeholder="00000-000"
                {...register('cep', { required: "CEP é obrigatório" })}
              />
              {errors.cep && <p className="text-wp-error text-sm">{errors.cep.message}</p>}
            </div>
            
            {/* Site */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Site</label>
              <input
                type="url"
                className="wp-input w-full"
                placeholder="https://www.example.com"
                {...register('site')}
              />
            </div>
            
            {/* Instagram */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Instagram</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="@seuinstagram"
                {...register('instagram')}
              />
            </div>
            
            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">WhatsApp</label>
              <input
                type="text"
                className="wp-input w-full"
                placeholder="(00) 00000-0000"
                {...register('whatsapp')}
              />
            </div>
            
            {/* Nicho */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Nicho*</label>
              <select 
                className={`wp-input w-full ${errors.nicho ? 'border-wp-error' : ''}`}
                {...register('nicho', { required: "Nicho é obrigatório" })}
              >
                <option value="">Selecione um nicho</option>
                {nichos.map((nicho, index) => (
                  <option key={index} value={nicho}>{nicho}</option>
                ))}
              </select>
              {errors.nicho && <p className="text-wp-error text-sm">{errors.nicho.message}</p>}
            </div>
            
            {/* Desconto */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Desconto Oferecido*</label>
              <input
                type="text"
                className={`wp-input w-full ${errors.desconto ? 'border-wp-error' : ''}`}
                placeholder="10% em todos os produtos"
                {...register('desconto', { required: "Desconto é obrigatório" })}
              />
              {errors.desconto && <p className="text-wp-error text-sm">{errors.desconto.message}</p>}
            </div>
            
            {/* Produtos/Serviços */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium">Produtos/Serviços*</label>
              <textarea
                className={`wp-input w-full h-32 ${errors.produtos ? 'border-wp-error' : ''}`}
                placeholder="Descreva os produtos/serviços oferecidos pela empresa"
                {...register('produtos', { required: "Produtos/Serviços é obrigatório" })}
              ></textarea>
              {errors.produtos && <p className="text-wp-error text-sm">{errors.produtos.message}</p>}
            </div>
          </div>
          
          <div className="wp-notice-warning">
            <p className="font-medium">Atenção</p>
            <p className="text-sm">Após o cadastro, a empresa ficará com status pendente de aprovação até que os dados sejam verificados.</p>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="wp-button-secondary mr-2"
              onClick={() => reset()}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="wp-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEmpresa;
