/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Trucks } from './pages/admin/Trucks';
import { Harvest } from './pages/Harvest';
import { HarvestDetail } from './pages/HarvestDetail';
import { Fuel } from './pages/Fuel';
import { Stock } from './pages/Stock';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { GlobalFiltersProvider } from './contexts/GlobalFiltersContext';
import { Safras } from './pages/admin/Safras';
import { Talhoes } from './pages/admin/Talhoes';
import { Crops } from './pages/admin/Crops';
import { Users } from './pages/admin/Users';
import { Profile } from './pages/Profile';
import { Machines } from './pages/admin/Machines';
import { Financial } from './pages/Financial';
import { FinancialDetail } from './pages/FinancialDetail';
import { Activities } from './pages/Activities';
import { ActivityDetail } from './pages/ActivityDetail';
import { StockDetail } from './pages/StockDetail';
import { FuelDetail } from './pages/FuelDetail';
import { MachineDetail } from './pages/MachineDetail';
import { TruckDetail } from './pages/TruckDetail';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <GlobalFiltersProvider>
      <Router>
        <Layout onLogout={() => setIsAuthenticated(false)}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/harvest" element={<Harvest />} />
            <Route path="/harvest/:id" element={<HarvestDetail />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/fuel/:id" element={<FuelDetail />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/stock/:id" element={<StockDetail />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/financial/:id" element={<FinancialDetail />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            
            <Route path="/admin/safras" element={<Safras />} />
            <Route path="/admin/talhoes" element={<Talhoes />} />
            <Route path="/admin/machines" element={<Machines />} />
            <Route path="/admin/machines/:id" element={<MachineDetail />} />
            <Route path="/admin/trucks" element={<Trucks />} />
            <Route path="/admin/trucks/:id" element={<TruckDetail />} />
            <Route path="/admin/crops" element={<Crops />} />
            <Route path="/admin/users" element={<Users />} />
            
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </GlobalFiltersProvider>
  );
}
