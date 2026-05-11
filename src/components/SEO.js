import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    // Update document title
    document.title = title ? `${title} | SitePilot` : 'SitePilot - AI Construction Intelligence';

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || 'AI-powered construction intelligence platform for smarter project planning');
    }
  }, [title, description]);

  // No DOM output — just side effects
  return null;
};

export default SEO;
