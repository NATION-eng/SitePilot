import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | SitePilot` : 'SitePilot - Smart Construction Intelligence';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || 'Smart construction intelligence platform for pre-construction estimating and risk analysis');
    }
  }, [title, description]);

  // No DOM output — just side effects
  return null;
};

export default SEO;
