import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Settings, MapPin, Phone, User, Building, Clock, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { villes } from '../data/villes';

interface PharmacyData {
  id: string;
  name: string;
  pharmacistName: string;
  address: string;
  city: string;
  phone: string;
  status: 'en garde' | 'fermé';
  verified: boolean;
  createdAt: string;
}

const PharmacistDashboard = () => {
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pharmacistName: '',
    address: '',
    city: '',
    phone: ''
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchPharmacyData();
    }
  }, [currentUser]);

  const fetchPharmacyData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const docRef = doc(db, 'pharmacies', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as PharmacyData;
        setPharmacy(data);
        setFormData({
          name: data.name,
          pharmacistName: data.pharmacistName,
          address: data.address,
          city: data.city,
          phone: data.phone
        });
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!pharmacy || !currentUser) return;

    const newStatus = pharmacy.status === 'en garde' ? 'fermé' : 'en garde';
    
    try {
      await updateDoc(doc(db, 'pharmacies', currentUser.uid), {
        status: newStatus
      });

      setPharmacy(prev => prev ? { ...prev, status: newStatus } : null);

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Votre pharmacie est maintenant ${newStatus === 'en garde' ? 'en garde' : 'fermée'}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour le statut'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, 'pharmacies', currentUser.uid), {
        name: formData.name,
        pharmacistName: formData.pharmacistName,
        address: formData.address,
        city: formData.city,
        phone: formData.phone
      });

      setPharmacy(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);

      Swal.fire({
        icon: 'success',
        title: 'Informations mises à jour',
        text: 'Vos informations ont été mises à jour avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating pharmacy:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour les informations'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Aucune pharmacie trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Settings className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Mon Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Gérez les informations de votre pharmacie
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                pharmacy.status === 'en garde' 
                  ? 'bg-emerald-100' 
                  : 'bg-red-100'
              }`}>
                <Clock className={`h-6 w-6 ${
                  pharmacy.status === 'en garde' 
                    ? 'text-emerald-600' 
                    : 'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Statut actuel
                </h3>
                <p className={`text-sm font-medium ${
                  pharmacy.status === 'en garde' 
                    ? 'text-emerald-600' 
                    : 'text-red-600'
                }`}>
                  {pharmacy.status === 'en garde' ? 'En garde' : 'Fermée'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleStatus}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                pharmacy.status === 'en garde'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {pharmacy.status === 'en garde' ? 'Fermer' : 'Ouvrir'}
            </button>
          </div>
        </div>

        {/* Verification Status */}
        <div className={`p-4 rounded-lg mb-8 ${
          pharmacy.verified 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-center space-x-2">
            {pharmacy.verified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-orange-600" />
            )}
            <p className={`font-medium ${
              pharmacy.verified ? 'text-green-800' : 'text-orange-800'
            }`}>
              {pharmacy.verified 
                ? 'Votre pharmacie est vérifiée' 
                : 'Votre pharmacie est en attente de vérification par un administrateur'
              }
            </p>
          </div>
        </div>

        {/* Pharmacy Information */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Informations de la pharmacie
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la pharmacie
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du pharmacien
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="pharmacistName"
                      value={formData.pharmacistName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="">Sélectionnez une ville</option>
                    {villes.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nom de la pharmacie</p>
                    <p className="font-medium text-gray-900">{pharmacy.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Pharmacien</p>
                    <p className="font-medium text-gray-900">Dr. {pharmacy.pharmacistName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-medium text-gray-900">{pharmacy.address}</p>
                  <p className="text-sm text-gray-500">{pharmacy.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium text-gray-900">{pharmacy.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;