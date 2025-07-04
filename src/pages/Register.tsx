import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, MapPin, Phone, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import { villes } from '../data/villes';
import { 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  sanitizeInput, 
  validateRequired, 
  validateLength,
  formatPhoneNumber 
} from '../utils/validation';
import { handleFirebaseError } from '../utils/errorHandling';
import { useRetry } from '../hooks/useRetry';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';

interface FormErrors {
  [key: string]: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
    pharmacistName: '',
    address: '',
    city: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { retry, isRetrying } = useRetry();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      newErrors.email = emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    const passwordError = validateRequired(formData.password, 'Mot de passe');
    if (passwordError) {
      newErrors.password = passwordError;
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Pharmacist name validation
    const pharmacistNameError = validateRequired(formData.pharmacistName, 'Nom du pharmacien');
    if (pharmacistNameError) {
      newErrors.pharmacistName = pharmacistNameError;
    } else {
      const lengthError = validateLength(formData.pharmacistName, 2, 50, 'Nom du pharmacien');
      if (lengthError) newErrors.pharmacistName = lengthError;
    }

    // Pharmacy name validation
    const pharmacyNameError = validateRequired(formData.pharmacyName, 'Nom de la pharmacie');
    if (pharmacyNameError) {
      newErrors.pharmacyName = pharmacyNameError;
    } else {
      const lengthError = validateLength(formData.pharmacyName, 2, 100, 'Nom de la pharmacie');
      if (lengthError) newErrors.pharmacyName = lengthError;
    }

    // Address validation
    const addressError = validateRequired(formData.address, 'Adresse');
    if (addressError) {
      newErrors.address = addressError;
    } else {
      const lengthError = validateLength(formData.address, 10, 200, 'Adresse');
      if (lengthError) newErrors.address = lengthError;
    }

    // City validation
    const cityError = validateRequired(formData.city, 'Ville');
    if (cityError) {
      newErrors.city = cityError;
    }

    // Phone validation
    const phoneError = validateRequired(formData.phone, 'Téléphone');
    if (phoneError) {
      newErrors.phone = phoneError;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide (ex: +212 6XX XXX XXX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sanitizedData = {
        email: sanitizeInput(formData.email.toLowerCase()),
        password: formData.password,
        pharmacyName: sanitizeInput(formData.pharmacyName),
        pharmacistName: sanitizeInput(formData.pharmacistName),
        address: sanitizeInput(formData.address),
        city: formData.city,
        phone: formatPhoneNumber(formData.phone)
      };

      const pharmacyData = {
        name: sanitizedData.pharmacyName,
        pharmacistName: sanitizedData.pharmacistName,
        address: sanitizedData.address,
        city: sanitizedData.city,
        phone: sanitizedData.phone
      };

      await retry(() => register(sanitizedData.email, sanitizedData.password, pharmacyData));
      
      Swal.fire({
        icon: 'success',
        title: 'Inscription réussie!',
        text: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
        timer: 3000,
        showConfirmButton: false
      });
      
      navigate('/login');
    } catch (error: any) {
      const appError = handleFirebaseError(error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur d\'inscription',
        text: appError.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const isFormLoading = loading || isRetrying;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead 
        title="Inscription Pharmacien - Rejoignez notre réseau"
        description="Inscrivez votre pharmacie sur notre plateforme et gérez vos horaires de garde en temps réel."
        keywords="inscription pharmacien, enregistrer pharmacie, pharmacie garde maroc"
      />

      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Inscription Pharmacien
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre compte pour gérer votre pharmacie
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pharmacistName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pharmacien *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="pharmacistName"
                    name="pharmacistName"
                    type="text"
                    value={formData.pharmacistName}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-10 py-3 border ${
                      errors.pharmacistName ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                    placeholder="Dr. Mohamed Alami"
                    maxLength={50}
                  />
                </div>
                {errors.pharmacistName && (
                  <p className="mt-1 text-sm text-red-600">{errors.pharmacistName}</p>
                )}
              </div>

              <div>
                <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la pharmacie *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="pharmacyName"
                    name="pharmacyName"
                    type="text"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-10 py-3 border ${
                      errors.pharmacyName ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                    placeholder="Pharmacie Al Amal"
                    maxLength={100}
                  />
                </div>
                {errors.pharmacyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.pharmacyName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-10 py-3 pr-12 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-10 py-3 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-10 py-3 border ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                  placeholder="123 Rue Mohammed V, Quartier Gueliz"
                  maxLength={200}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-3 py-3 border ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  } text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                >
                  <option value="">Sélectionnez une ville</option>
                  {villes.map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-10 py-3 border ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isFormLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isFormLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte?{' '}
                <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;