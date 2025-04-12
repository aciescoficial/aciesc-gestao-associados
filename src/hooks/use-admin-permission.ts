
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export function useAdminPermission() {
  const { isAdmin, userRole, userTags } = useAuth();
  const { toast } = useToast();

  const checkAdminPermission = (): boolean => {
    if (!isAdmin) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem realizar esta ação.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const checkFinanceiroPermission = (): boolean => {
    if (!isAdmin && !userTags.includes('financeiro')) {
      toast({
        title: "Permissão negada",
        description: "Você não tem permissão para acessar recursos financeiros.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { 
    isAdmin,
    userRole, 
    checkAdminPermission,
    checkFinanceiroPermission,
    hasFinanceiroAccess: isAdmin || userTags.includes('financeiro')
  };
}
