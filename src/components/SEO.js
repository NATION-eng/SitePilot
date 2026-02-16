// SEO Component - requires react-helmet-async to be installed
// Run: npm install react-helmet-async

import React from 'react';
// import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, type = 'website' }) => {
  // Uncomment when react-helmet-async is installed
  /*
  return (
    <Helmet>
      <title>{title} | SitePilot</title>
      <meta name="description" content={description} />
      
      {/* Open Graph *\/}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="SitePilot" />
      
      {/* Twitter *\/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Structured Data *\/}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "SitePilot",
          "description": description,
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NGN"
          }
        })}
      </script>
    </Helmet>
  );
  */
  
  // Temporary fallback until react-helmet-async is installed
  return null;
};

export default SEO;
