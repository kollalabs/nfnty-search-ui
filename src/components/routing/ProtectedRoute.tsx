import React from 'react';
import { FC } from 'react';
import { Navigate, Route, RouteProps, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute: FC<RouteProps> = ({ ...routeProps }) => {
  const { isAuthenticated } = useAuth0();
  let location = useLocation();

  if (isAuthenticated) {
    return <Route {...routeProps} />;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
