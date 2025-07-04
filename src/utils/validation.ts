// Input validation and sanitization utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  // Moroccan phone number validation
  const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} est requis`;
  }
  return null;
};

export const validateLength = (
  value: string, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  const length = value.trim().length;
  if (length < min) {
    return `${fieldName} doit contenir au moins ${min} caractères`;
  }
  if (length > max) {
    return `${fieldName} ne peut pas dépasser ${max} caractères`;
  }
  return null;
};

export const formatPhoneNumber = (phone: string): string => {
  // Format Moroccan phone numbers
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('212')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+212${cleaned.substring(1)}`;
  } else if (cleaned.length === 9) {
    return `+212${cleaned}`;
  }
  
  return phone;
};