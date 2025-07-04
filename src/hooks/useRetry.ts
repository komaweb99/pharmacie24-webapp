import { useState, useCallback } from 'react';
import { retryOperation } from '../utils/errorHandling';

export const useRetry = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> => {
    setIsRetrying(true);
    try {
      const result = await retryOperation(operation, maxRetries);
      return result;
    } finally {
      setIsRetrying(false);
    }
  }, []);

  return { retry, isRetrying };
};