import { useEffect } from 'react';

export const useHttpsRedirect = () => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' && // Check if we're running in the browser
      window.location.protocol !== 'https:'
    ) {
      window.location.replace(`https://${window.location.href.split('//')[1]}`);
    }
  }, []);
};

