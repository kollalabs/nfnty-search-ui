import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === '/start.html') {
      window.location.href = `${window.location.origin}/start.html`;
    }

  });

  return null;
};

export default NotFoundPage;
