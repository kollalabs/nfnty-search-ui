import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import AppLayout from '../components/AppLayout';

const RoutesMap = () => (
  <Router>
    <Routes>
      <Route path="*" element={<AppLayout />} />
    </Routes>
  </Router>
);

export default RoutesMap;
