import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = (forwardRef: string = '/search') => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated) {
        navigate(forwardRef);
      } else {
        await loginWithRedirect();
      }
    }

    checkAuth();
  }, [isAuthenticated, loginWithRedirect]);
};

export default useAuthCheck;
