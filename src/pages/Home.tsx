import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, MapPin, Shield, Phone, Heart } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pharmacies de Garde Maroc",
    "description": "Trouvez rapidement les pharmacies de garde ouvertes près de chez vous au Maroc",
    "url": import.meta.env.VITE_APP_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${import.meta.env.VITE_APP_URL}/pharmacies?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        structuredData={structuredData}
        keywords="pharmacie garde maroc, pharmacie ouverte, urgence médicale maroc, pharmacie 24h"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez Votre Pharmacie de Garde
              <span className="block text-emerald-200">au Maroc</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Service gratuit et mis à jour en temps réel pour localiser les pharmacies ouvertes près de chez vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pharmacies"
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg"
              >
                <Search className="inline-block mr-2 h-5 w-5" />
                Rechercher une Pharmacie
              </Link>
              <Link
                to="/register"
                className="bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Inscrire ma Pharmacie
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un Service Moderne et Fiable
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme vous aide à trouver rapidement les pharmacies ouvertes dans votre ville
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <Clock className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Temps Réel</h3>
              <p className="text-gray-600">
                Informations mises à jour en direct par les pharmaciens eux-mêmes
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Géolocalisation</h3>
              <p className="text-gray-600">
                Trouvez les pharmacies les plus proches de votre position
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fiabilité</h3>
              <p className="text-gray-600">
                Données vérifiées et pharmacies certifiées par notre équipe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Un Service de Confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-gray-600">Pharmacies Partenaires</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Service Disponible</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
              <p className="text-gray-600">Régions Couvertes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <p className="text-gray-600">Gratuit</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Votre Santé, Notre Priorité
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Accédez rapidement aux soins dont vous avez besoin, quand vous en avez besoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pharmacies"
              className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Trouver une Pharmacie
            </Link>
            <a
              href="tel:141"
              className="bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <Phone className="inline-block mr-2 h-5 w-5" />
              Urgence: 141
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pharmacies de Garde</h3>
              <p className="text-gray-400">
                Votre service de référence pour localiser les pharmacies ouvertes au Maroc
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Liens Utiles</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pharmacies" className="hover:text-white">Pharmacies</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/register" className="hover:text-white">S'inscrire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Urgences</h4>
              <ul className="space-y-2 text-gray-400">
                <li>SAMU: 141</li>
                <li>Police: 19</li>
                <li>Pompiers: 15</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: {import.meta.env.VITE_CONTACT_EMAIL}<br />
                Téléphone: +212 5XX XXX XXX
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pharmacies de Garde Maroc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;