
type RateLimitError = {
  code?: string;
  retryAfter?: number | null;
  message?: string;
};

export const handleSignUpError = (error: any) => {
  if (!error) return null;

  const typedError = error as RateLimitError;
  
  const isRateLimit = 
    (typedError.code === 'rate_limit') || 
    (typeof error === 'object' && 
     'message' in error && 
     (error as { message: string }).message.includes('rate limit'));

  return {
    isRateLimit,
    retryTime: typedError.retryAfter ?? 60,
    message: typedError.message || "Erro ao criar conta"
  };
};
