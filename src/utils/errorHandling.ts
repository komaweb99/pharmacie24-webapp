// Error handling utilities

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export const createError = (code: string, message: string, details?: any): AppError => ({
  code,
  message,
  details
});

export const handleFirebaseError = (error: any): AppError => {
  const errorCode = error.code || 'unknown';
  
  switch (errorCode) {
    case 'auth/user-not-found':
      return createError('auth/user-not-found', 'Aucun utilisateur trouvé avec cet email');
    
    case 'auth/wrong-password':
      return createError('auth/wrong-password', 'Mot de passe incorrect');
    
    case 'auth/email-already-in-use':
      return createError('auth/email-already-in-use', 'Cet email est déjà utilisé');
    
    case 'auth/weak-password':
      return createError('auth/weak-password', 'Le mot de passe est trop faible');
    
    case 'auth/invalid-email':
      return createError('auth/invalid-email', 'Format d\'email invalide');
    
    case 'auth/too-many-requests':
      return createError('auth/too-many-requests', 'Trop de tentatives. Veuillez réessayer plus tard');
    
    case 'permission-denied':
      return createError('permission-denied', 'Vous n\'avez pas les permissions nécessaires');
    
    case 'unavailable':
      return createError('unavailable', 'Service temporairement indisponible. Veuillez réessayer');
    
    case 'failed-precondition':
      return createError('failed-precondition', 'Les données requises ne sont pas disponibles');
    
    default:
      return createError(
        errorCode, 
        error.message || 'Une erreur inattendue s\'est produite',
        error
      );
  }
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

export const isNetworkError = (error: any): boolean => {
  return (
    error.code === 'unavailable' ||
    error.code === 'deadline-exceeded' ||
    error.message?.includes('network') ||
    error.message?.includes('offline')
  );
};