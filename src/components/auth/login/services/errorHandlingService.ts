
// Define strict types for different kinds of errors
type BaseError = {
  message?: string;
};

type RateLimitError = BaseError & {
  code?: string;
  retryAfter?: number | null;
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

  // Handle rate limit errors
  const typedError = error as RateLimitError;
  const isRateLimit = 
    (typedError.code === 'rate_limit') || 
    (typeof error === 'object' && 
     'message' in error && 
     typeof (error as { message: unknown }).message === 'string' &&
     (error as { message: string }).message.includes('rate limit'));

  return {
    isRateLimit,
    retryTime: typedError.retryAfter ?? defaultResponse.retryTime,
    message: typedError.message || defaultResponse.message
  };
};
