
// Define strict types for different kinds of errors
type BaseError = {
  message?: string;
};

type RateLimitError = BaseError & {
  code?: string;
  retryAfter?: number | null;
  status?: number;
};

type ErrorResponse = {
  isRateLimit: boolean;
  retryTime: number;
  message: string;
};

/**
 * Handles sign up errors with proper type checking and validation
 */
export const handleSignUpError = (error: unknown): ErrorResponse => {
  // Default error response
  const defaultResponse: ErrorResponse = {
    isRateLimit: false,
    retryTime: 60,
    message: "Erro ao criar conta"
  };

  // If no error provided, return default response
  if (!error) {
    return defaultResponse;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      ...defaultResponse,
      message: error
    };
  }

  // Handle object errors
  if (typeof error === 'object' && error !== null) {
    // Cast to a type that might have message and code properties
    const typedError = error as RateLimitError;
    
    // Check for rate limit indication
    const isRateLimit = 
      (typedError.code === 'rate_limit' || typedError.code === 'over_email_send_rate_limit') || 
      (typedError.status === 429) ||
      ('message' in typedError && 
       typeof typedError.message === 'string' &&
       (typedError.message.includes('rate limit') || typedError.message.includes('limite')));

    // Extract retry time if available
    let retryTime = defaultResponse.retryTime;
    if (typedError.retryAfter && typeof typedError.retryAfter === 'number') {
      retryTime = typedError.retryAfter;
    }

    // Get message
    let message = defaultResponse.message;
    if (typedError.message) {
      message = typedError.message;
      
      // Enhanced Portuguese message for rate limits
      if (isRateLimit) {
        message = "Limite de cadastros excedido. Por favor aguarde alguns instantes ou contate o administrador.";
      }
    }

    return {
      isRateLimit,
      retryTime,
      message
    };
  }

  // Default fallback
  return defaultResponse;
};
