
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth";

export function useAdminPermission() {
  const { userRole, userTags } = useAuth();
  const { toast } = useToast();

  // Always return true for permission checks
  const checkAdminPermission = (): boolean => {
    return true;
  };

  const checkFinanceiroPermission = (): boolean => {
    return true;
  };

  return { 
    isAdmin: true,
    userRole, 
    checkAdminPermission,
    checkFinanceiroPermission,
    hasFinanceiroAccess: true
  };
}
