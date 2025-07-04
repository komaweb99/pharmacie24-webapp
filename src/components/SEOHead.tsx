import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Pharmacies de Garde au Maroc - Trouvez votre pharmacie ouverte',
  description = 'Trouvez rapidement les pharmacies de garde ouvertes près de chez vous au Maroc. Service gratuit et mis à jour en temps réel.',
  keywords = 'pharmacie, garde, maroc, urgence, médicaments, santé, 24h, nuit',
  image = '/pharmacy-icon.svg',
  url = import.meta.env.VITE_APP_URL || 'https://pharmacie24-193a2.web.app',
  type = 'website',
  structuredData
}) => {
  const fullTitle = title.includes('Pharmacies de Garde') ? title : `${title} | Pharmacies de Garde Maroc`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pharmacies de Garde Maroc" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="fr" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.country" content="Morocco" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Pharmacies de Garde Maroc" />
      <meta property="og:locale" content="fr_MA" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;