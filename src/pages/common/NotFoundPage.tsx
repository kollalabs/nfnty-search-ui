import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/start.html' || location.pathname === '/') {
      window.location.href = `${window.location.origin}/start.html`;
    }
  });

  return <Navigate to={'/login'} replace />;
};

export default NotFoundPage;
