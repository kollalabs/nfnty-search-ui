import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

const RoutesStatic = () => (
  <Router>
    <Routes>
      <Route
        path="/"
        element={<Navigate replace to={{ pathname: '/start.html' }} />}
      />
    </Routes>
  </Router>
);

export default RoutesStatic;
