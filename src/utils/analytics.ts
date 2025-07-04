import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

// Analytics event types
export const ANALYTICS_EVENTS = {
  SEARCH_PHARMACY: 'search_pharmacy',
  VIEW_PHARMACY: 'view_pharmacy',
  CALL_PHARMACY: 'call_pharmacy',
  REGISTER_PHARMACY: 'register_pharmacy',
  LOGIN: 'login',
  TOGGLE_PHARMACY_STATUS: 'toggle_pharmacy_status',
  ERROR_OCCURRED: 'error_occurred'
} as const;

// Track search events
export const trackPharmacySearch = (searchTerm: string, city?: string) => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.SEARCH_PHARMACY, {
      search_term: searchTerm,
      city: city || 'all'
    });
  }
};

// Track pharmacy view
export const trackPharmacyView = (pharmacyId: string, pharmacyName: string) => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.VIEW_PHARMACY, {
      pharmacy_id: pharmacyId,
      pharmacy_name: pharmacyName
    });
  }
};

// Track phone calls
export const trackPharmacyCall = (pharmacyId: string, pharmacyName: string) => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.CALL_PHARMACY, {
      pharmacy_id: pharmacyId,
      pharmacy_name: pharmacyName
    });
  }
};

// Track user registration
export const trackUserRegistration = (userType: 'pharmacist' | 'admin') => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.REGISTER_PHARMACY, {
      user_type: userType
    });
  }
};

// Track login
export const trackUserLogin = (userType: 'pharmacist' | 'admin') => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.LOGIN, {
      user_type: userType
    });
  }
};

// Track pharmacy status changes
export const trackPharmacyStatusToggle = (pharmacyId: string, newStatus: string) => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.TOGGLE_PHARMACY_STATUS, {
      pharmacy_id: pharmacyId,
      new_status: newStatus
    });
  }
};

// Track errors
export const trackError = (errorCode: string, errorMessage: string, page?: string) => {
  if (analytics) {
    logEvent(analytics, ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_code: errorCode,
      error_message: errorMessage,
      page: page || window.location.pathname
    });
  }
};