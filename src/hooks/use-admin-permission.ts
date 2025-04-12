
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export function useAdminPermission() {
  const { isAdmin } = useAuth();
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

  return { isAdmin, checkAdminPermission };
}
