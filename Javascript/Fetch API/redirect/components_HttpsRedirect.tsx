import { useHttpsRedirect } from '../hooks/useHttpsRedirect';

export const HttpsRedirect: React.FC = () => {
  useHttpsRedirect();
  return null; // This component doesn't render anything
};

