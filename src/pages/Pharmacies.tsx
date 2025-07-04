import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Phone, Clock, Search } from 'lucide-react';
import { villes } from '../data/villes';

interface Pharmacy {
  id: string;
  name: string;
  pharmacistName: string;
  address: string;
  city: string;
  phone: string;
  status: 'en garde' | 'fermé';
  verified: boolean;
}

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPharmacies();
  }, [selectedCity]);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'pharmacies'),
        where('status', '==', 'en garde'),
        where('verified', '==', true),
        orderBy('name')
      );

      if (selectedCity) {
        q = query(
          collection(db, 'pharmacies'),
          where('status', '==', 'en garde'),
          where('verified', '==', true),
          where('city', '==', selectedCity),
          orderBy('name')
        );
      }

      const querySnapshot = await getDocs(q);
      const pharmaciesData: Pharmacy[] = [];
      
      querySnapshot.forEach((doc) => {
        pharmaciesData.push({
          id: doc.id,
          ...doc.data()
        } as Pharmacy);
      });

      setPharmacies(pharmaciesData);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.pharmacistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pharmacies de Garde
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez les pharmacies ouvertes près de chez vous
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Toutes les villes</option>
                {villes.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Nom de la pharmacie ou du pharmacien..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Chargement des pharmacies...</p>
          </div>
        ) : filteredPharmacies.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-200">
              <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Aucune pharmacie de garde trouvée
              </h3>
              <p className="text-yellow-700">
                {selectedCity 
                  ? `Aucune pharmacie de garde n'est actuellement disponible à ${selectedCity}.`
                  : 'Aucune pharmacie de garde n\'est actuellement disponible.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {pharmacy.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Dr. {pharmacy.pharmacistName}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Ouverte
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 text-sm">{pharmacy.address}</p>
                      <p className="text-gray-500 text-xs">{pharmacy.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <a 
                      href={`tel:${pharmacy.phone}`}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {pharmacy.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      Pharmacie de garde
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pharmacies;