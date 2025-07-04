import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, Eye, EyeOff, MapPin, Phone, User, Building, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface Pharmacy {
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

const AdminDashboard = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'pharmacies'), orderBy('createdAt', 'desc'));
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

  const togglePharmacyStatus = async (pharmacyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'en garde' ? 'fermé' : 'en garde';
    
    try {
      await updateDoc(doc(db, 'pharmacies', pharmacyId), {
        status: newStatus
      });

      setPharmacies(prev => 
        prev.map(pharmacy => 
          pharmacy.id === pharmacyId 
            ? { ...pharmacy, status: newStatus as 'en garde' | 'fermé' }
            : pharmacy
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Statut mis à jour',
        text: `Pharmacie ${newStatus === 'en garde' ? 'ouverte' : 'fermée'}`,
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

  const toggleVerification = async (pharmacyId: string, currentVerified: boolean) => {
    try {
      await updateDoc(doc(db, 'pharmacies', pharmacyId), {
        verified: !currentVerified
      });

      setPharmacies(prev => 
        prev.map(pharmacy => 
          pharmacy.id === pharmacyId 
            ? { ...pharmacy, verified: !currentVerified }
            : pharmacy
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Vérification mise à jour',
        text: `Pharmacie ${!currentVerified ? 'vérifiée' : 'non vérifiée'}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de mettre à jour la vérification'
      });
    }
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    if (filter === 'verified') return pharmacy.verified;
    if (filter === 'unverified') return !pharmacy.verified;
    return true;
  });

  const stats = {
    total: pharmacies.length,
    verified: pharmacies.filter(p => p.verified).length,
    unverified: pharmacies.filter(p => !p.verified).length,
    onDuty: pharmacies.filter(p => p.status === 'en garde').length
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard Administrateur
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Gérez les pharmacies et leurs statuts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pharmacies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vérifiées</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non Vérifiées</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unverified}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Garde</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.onDuty}</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'verified' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vérifiées ({stats.verified})
            </button>
            <button
              onClick={() => setFilter('unverified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unverified' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Non Vérifiées ({stats.unverified})
            </button>
          </div>
        </div>

        {/* Pharmacies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement des pharmacies...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {pharmacy.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pharmacy.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {pharmacy.verified ? 'Vérifiée' : 'Non vérifiée'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          pharmacy.status === 'en garde'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pharmacy.status === 'en garde' ? 'En garde' : 'Fermée'}
                        </span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Dr. {pharmacy.pharmacistName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{pharmacy.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div>
                          <p>{pharmacy.address}</p>
                          <p className="text-xs text-gray-500">{pharmacy.city}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Inscrite le {new Date(pharmacy.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleVerification(pharmacy.id, pharmacy.verified)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pharmacy.verified
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {pharmacy.verified ? 'Retirer vérification' : 'Vérifier'}
                    </button>
                    <button
                      onClick={() => togglePharmacyStatus(pharmacy.id, pharmacy.status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pharmacy.status === 'en garde'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {pharmacy.status === 'en garde' ? 'Fermer' : 'Ouvrir'}
                    </button>
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

export default AdminDashboard;