
import { useCallback, useRef } from 'react';

/**
 * Custom hook for handling timeouts
 * @param ms Time in milliseconds before timeout
 * @param fallbackValue Value to return on timeout
 */
export const useTimeout = <T>(ms: number, fallbackValue: T) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const withTimeout = useCallback(
    async (promise: Promise<T>): Promise<T> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create a promise that rejects after ms milliseconds
      const timeoutPromise = new Promise<T>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          console.log(`Operation timed out after ${ms}ms, using default values`);
          reject(new Error(`Operation timed out after ${ms}ms`));
        }, ms);
      });

      try {
        // Race the actual promise against the timeout
        const result = await Promise.race([promise, timeoutPromise]);
        
        // Clear the timeout if the promise resolved
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        return result;
      } catch (error) {
        // Clear the timeout if the promise rejected
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        console.error('Operation failed with error:', error);
        return fallbackValue;
      }
    },
    [ms, fallbackValue]
  );

  return { withTimeout };
};
