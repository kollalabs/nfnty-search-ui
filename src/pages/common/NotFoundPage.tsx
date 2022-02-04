import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/start.html' || location.pathname === '/') {
      window.location.href = `${window.location.origin}/start.html`;
    }
  });

  return null;
};

export default NotFoundPage;
